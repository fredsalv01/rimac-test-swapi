import { HistoryData } from "../entities/history-data.entity";
import { MergeData } from "../entities/merge-data.entity";

export interface HistoryDataRepository {
    save(mergeData: Partial<MergeData[]>): Promise<void>;
    history(limit: number, startKey?: Record<string, any>): Promise<{items: HistoryData[];lastKey?: Record<string, any>;}>;
}