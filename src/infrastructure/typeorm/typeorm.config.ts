import { DataSource } from 'typeorm';
import { HistoryData } from '../../domain/entities/HistoryData.entity';


export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [HistoryData],
    synchronize: true,
});