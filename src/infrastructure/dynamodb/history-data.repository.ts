import { PutCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { MergeData } from "../../domain/entities/merge-data.entity";
import { HistoryDataRepository } from "../../domain/repositories/history-data.repository";
import { DynamoDBBaseRepository } from "./base/dynamodb.repository";
import { DateTimeFormat } from "../../shared/functions/DateTimeFormat";
import {v4 as uuid } from 'uuid'
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { HistoryData } from "../../domain/entities/history-data.entity";

export class DynamoDBHistoryDataRepository extends DynamoDBBaseRepository implements HistoryDataRepository {
    constructor() {
        super(process.env.CHARACTERS_TABLE || 'Characters');
    }
    // funcion para guardar data de datos fusionados
    async save(data: MergeData): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: {
                    id: uuid(),
                    mergeData: JSON.stringify(data.toPrimitives()),
                    createdAt: DateTimeFormat()
                }
            })
        )
    }

    // mostrar el historico de respuestas guardados.
    async history(filters: any[], limit: number, startKey?: Record<string, any>): Promise<{
        items: HistoryData[];
        lastKey?: Record<string, any>;
    }> {
        const params: ScanCommandInput = {
            TableName: this.tableName,
            Limit: limit
        };

        if(startKey) {
            params.ExclusiveStartKey = startKey;
        }

        const response = await this.client.send(new ScanCommand(params));

        const items = (response.Items || []).map((item: any) => {
            const parsed = JSON.parse(item?.mergeData);
            return HistoryData.fromPrimitives(parsed);
        });

        return {
            items,
            lastKey: response.LastEvaluatedKey
        };
    }
}