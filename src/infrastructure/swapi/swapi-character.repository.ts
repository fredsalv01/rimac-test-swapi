import axios from 'axios';
import { Character } from '../../domain/entities/characters.entity';
import { CharacterRepositoryPort } from '../../domain/repositories/character-port.repository';

export class SwapiCharacterRepository implements CharacterRepositoryPort {
    async getAll(page = 1, limit = 10): Promise<{data: Character[], total: number}> {
        const response = await axios.get<Character[]>("https://swapi.info/api/people");
        if (!response) {
            throw new Error("No se pudo obtener la data de los personajes desde SWAPI");
        }
        const start = (page - 1) * limit;
        const end = start + limit;

        return {
            data: response.data.slice(start, end).map((item: any) => new Character(
                item.name,
                item.height,
                item.birth_year,
                item.gender
            )),
            total: response.data.length
        };
    }
}
