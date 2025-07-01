import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('history_data')
export class HistoryData {
  constructor() {
    this.id = '';
    this.mergeData = '';
    this.createdAt = new Date();
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  mergeData: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}