import { Character } from '../entities/characters.entity';

export interface CharacterRepositoryPort {
  getAll(): Promise<Character[]>;
}