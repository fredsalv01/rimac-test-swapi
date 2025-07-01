import axios from 'axios';
import { SwapiCharacterRepository } from '../src/infrastructure/swapi/swapi-character.repository';
import { PokeApiRepository } from '../src/infrastructure/pokeapi/pokeapi.repository';
import { GetMergeDataUseCase } from '../src/application/get-merge.use-case';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GetMergeDataUseCase', () => {
  it('mezcla los resultados correctamente', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: [
          { name: 'Luke', height: '172', birth_year: '19BBY', gender: 'male' }
        ]
      })
      .mockResolvedValue({ data: { name: 'Pikachu' } });

    const swapiRepo = new SwapiCharacterRepository();
    const pokeRepo = new PokeApiRepository();
    const useCase = new GetMergeDataUseCase(swapiRepo, pokeRepo);

    const res = await useCase.execute(1, 1);

    expect(res.data).toEqual([
      expect.objectContaining({
        name: 'Luke',
        pokemon_team: Array(6).fill('Pikachu'),
      })
    ]);
    expect(mockedAxios.get).toHaveBeenCalledTimes(7);
  });
});