import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBBaseRepository } from "../dynamodb/base/dynamodb.repository";
import { getPeruDateTimeISO } from "../../shared/functions/DateTimeFormat";
import { DateTime } from "luxon";

export class DynamoDBCacheRepository extends DynamoDBBaseRepository {
    constructor() {
        super(process.env.CACHE_TABLE || 'CacheTable');
    }

    async getCache(key: string): Promise<any | null> {
        const response = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { cacheKey: key }
            })
        );
        
        if (!response.Item) return null;
        const createdAt = DateTime.fromISO(response.Item?.createdAt);
        const now = DateTime.now().setZone('America/Lima');
        if (now.diff(createdAt, 'minutes').minutes > 30) return null;
        return JSON.parse(response.Item.data);
    }

    async setCache(key: string, data: any): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: {
                    cacheKey: key,
                    data: JSON.stringify(data),
                    createdAt: getPeruDateTimeISO()
                }
            })
        );
    }
}