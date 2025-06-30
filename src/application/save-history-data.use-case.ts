import { MergeData } from '../domain/entities/merge-data.entity';
import { HistoryDataRepository } from '../domain/repositories/history-data.repository';
export class SaveHistoryDataUseCase {
    constructor(
        private readonly historyDataRepo: HistoryDataRepository
    ) {}
    async save(data: Partial<MergeData[]>): Promise<void> {
        return this.historyDataRepo.save(data);
    }
}