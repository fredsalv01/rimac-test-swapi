import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBBaseRepository } from "./base/dynamodb.repository";
import { v4 as uuid } from "uuid";
import { getPeruDateTimeISO } from "../../shared/functions/DateTimeFormat";
import { unmarshall } from "@aws-sdk/util-dynamodb";
export class DynamoDBCustomDataRepository extends DynamoDBBaseRepository {
    constructor() {
        super(process.env.CUSTOM_TABLE || "CustomDataTable");
    }

    async save(data: Record<string, any>): Promise<Record<string, any> | undefined> {
        const response = await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: {
                id: uuid(),
                data,
                createdAt: getPeruDateTimeISO()
                }
            })
        );

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error("Failed to save custom data");
        } else{
            console.log("Custom data saved successfully");
            if (response.Attributes) {
                const unmarshalledData = unmarshall(response.Attributes);
                return unmarshalledData;
            }
            return;
        }
        
    }
}