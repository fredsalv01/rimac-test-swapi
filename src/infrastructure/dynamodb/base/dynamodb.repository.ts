import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export abstract class DynamoDBBaseRepository {
    protected readonly client: DynamoDBDocumentClient;
    protected readonly tableName: string;

    constructor(tableName: string) {
        const baseClient = new DynamoDBClient({});
        this.client = DynamoDBDocumentClient.from(baseClient);
        this.tableName = tableName;
    }
}