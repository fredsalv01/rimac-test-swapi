import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBBaseRepository } from "./base/dynamodb.repository";
import { v4 as uuid } from "uuid";
import { getPeruDateTimeISO } from "../../shared/functions/DateTimeFormat";

export class DynamoDBCustomDataRepository extends DynamoDBBaseRepository {
    constructor() {
        super(process.env.CUSTOM_TABLE || "CustomDataTable");
    }

    async save(data: Record<string, any>): Promise<any> {
        const item = {
            id: uuid(),
            data,
            createdAt: getPeruDateTimeISO()
        };

        const response = await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: item,
            })
        );

        const getResponse = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { id: item.id }
            })
        )

        if (getResponse.Item) {
            return getResponse.Item;
        } else {
            throw new Error("Fallo al mostrar la data personalizada guardada");
        }
        
    }
}