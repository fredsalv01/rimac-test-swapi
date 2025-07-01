import axios from 'axios';
import { SwapiCharacterRepository } from '../src/infrastructure/swapi/swapi-character.repository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SwapiCharacterRepository', () => {
  const repo = new SwapiCharacterRepository();

  it('getCharacters devuelve personajes correctamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [
      { name: 'Luke', height: '172', birth_year: '19BBY', gender: 'male' },
      { name: 'Leia', height: '150', birth_year: '19BBY', gender: 'female' }
    ] });

    const result = await repo.getAll(1, 2);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toMatchObject({ name: 'Luke' });
  });
});