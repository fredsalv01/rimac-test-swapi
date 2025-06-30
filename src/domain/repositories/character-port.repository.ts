import { Character } from '../entities/characters.entity';

export interface CharacterRepositoryPort {
  getAll(page?: number, limit?: number): Promise<{
    data: Character[];
    total: number;
  }>;
}