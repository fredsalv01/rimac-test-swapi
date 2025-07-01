import { HistoryData } from "../entities/HistoryData.entity";
import { MergeData } from "../entities/merge-data.entity";

export interface HistoryDataRepository {
    save(mergeData: Partial<MergeData[]>): Promise<void>;
    history(page: number, limit: number): Promise<{items: HistoryData[];lastKey?: Record<string, any>;}>;
}