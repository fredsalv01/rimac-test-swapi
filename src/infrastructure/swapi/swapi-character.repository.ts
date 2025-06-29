import axios from 'axios';
import { Character } from '../../domain/entities/characters.entity';
import { CharacterRepositoryPort } from '../../domain/repositories/character-port.repository';

export class SwapiCharacterRepository implements CharacterRepositoryPort {
    async getAll(): Promise<Character[]> {
        const response = await axios.get<Character[]>("https://swapi.info/api/people");
        if (!response) {
            throw new Error("Invalid data format received from SWAPI");
        }
        return response.data.map((item: any) => new Character(
            item.name,
            item.height,
            item.birth_year,
            item.gender
        ));
    }
}
