import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { MergeData } from "../../domain/entities/merge-data.entity";
import { HistoryDataRepository } from "../../domain/repositories/history-data.repository";
import { DynamoDBBaseRepository } from "./base/dynamodb.repository";
import { getPeruDateTimeISO } from "../../shared/functions/DateTimeFormat";
import { HistoryData } from "../../domain/entities/history-data.entity";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {v4 as uuidv4} from 'uuid';
export class DynamoDBHistoryDataRepository extends DynamoDBBaseRepository implements HistoryDataRepository {
    constructor() {
        super(process.env.HISTORY_TABLE || 'HistoryTable');
    }
    // funcion para guardar data de datos fusionados
    async save(data: MergeData[]): Promise<void> {
        try {
            await this.client.send(
                new PutCommand({
                    TableName: this.tableName,
                    Item: {
                        id: "HISTORY_PARTITION_KEY",
                        uuid: uuidv4(),
                        mergeData: JSON.stringify(data.map(item => item.toPrimitives())),
                        createdAt: getPeruDateTimeISO()
                    }
                })
            );
        } catch (error) {
            console.error("Error saving merge data:", error);
            throw new Error("Failed to save merge data");
        }
    }

    // mostrar el historico de respuestas guardados.
    async history(limit: number = 10, startKey?: Record<string, any>): Promise<{
        items: HistoryData[];
        lastKey?: Record<string, any>;
    }> {
        console.log("limit:", limit, "startKey:", startKey);
        if (limit <= 0 || limit > 100) {
            throw new Error("Limit must be between 1 and 100");
        }
        
        try {
            const params: QueryCommandInput = {
                TableName: this.tableName,
                KeyConditionExpression: "#id = :idValue",
                ExpressionAttributeNames: {
                "#id": "id"
                },
                ExpressionAttributeValues: {
                ":idValue": { S: "HISTORY_PARTITION_KEY" } // clave fija si solo hay un historial global
                },
                Limit: limit,
                ScanIndexForward: true, // true = ascendente, false = descendente
            };

            if(startKey) {
                params.ExclusiveStartKey = startKey;
            }

            const response = await this.client.send(new QueryCommand(params));
            let items = (response.Items || []).map((item: any) => {
                // Deserializa cada ítem de DynamoDB
                const plainItem = unmarshall(item);
                return HistoryData.fromPrimitives({
                    id: String(plainItem.id),
                    uuid: String(plainItem.uuid),
                    mergeData: String(plainItem.mergeData),
                    createdAt: String(plainItem.createdAt)
                });
            });

            const lastKey = response.LastEvaluatedKey
            ? response.LastEvaluatedKey
            : undefined;
            return {
                items,  
                lastKey: lastKey
            };
        } catch (error) {
            console.error("Error fetching history data:", error);
            throw new Error("Failed to fetch history data");
        }
    }
}