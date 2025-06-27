import { MergeData } from '../entities/merge-data.entity';

export interface MergeDataRepository {
    find(): Promise<MergeData[]>;
}