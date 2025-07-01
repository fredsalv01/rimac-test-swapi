import { Repository } from "typeorm";
import { HistoryData } from "../../domain/entities/HistoryData.entity";
import { AppDataSource } from "../typeorm/typeorm.config";
import { HistoryDataRepository } from "../../domain/repositories/history-data.repository";
import { MergeData } from "../../domain/entities/merge-data.entity";
import { getPeruDateTimeISO } from "../../shared/functions/DateTimeFormat";
import { v4 as uuid } from "uuid";
export class MySQLHistoryDataRepository implements HistoryDataRepository {
    private repository: Repository<HistoryData>;

    constructor(){
        this.repository = AppDataSource.getRepository(HistoryData);
    }

    async save(data: Partial<MergeData[]>): Promise<void> {
        const historyData = this.repository.create({
            id: uuid(),
            mergeData: JSON.stringify(data),
            createdAt: getPeruDateTimeISO()
        });
        await this.repository.save(historyData);
        console.log("Datos guardados en el histórico correctamente");
    }

    async history(page: number, limit: number): Promise<{ items: HistoryData[]; total: number }> {
        try {
            const [items, total] = await this.repository.findAndCount({
                order: { createdAt: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
            });
            return { items, total };
        } catch (error) {
            console.error("Error al obtener el histórico:", error);
            throw new Error("Error al obtener el histórico");
        }
    }
}