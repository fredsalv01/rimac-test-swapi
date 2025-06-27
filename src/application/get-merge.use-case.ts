import { MergeData } from "../domain/entities/merge-data.entity";
import { MergeDataRepository } from "../domain/repositories/merge-data.repository";

export class GetMergeDataUseCase {
    constructor(
        private readonly repository: MergeDataRepository
    ){}

    async execute(): Promise<MergeData[]>{
        return await this.repository.find();
    }
}