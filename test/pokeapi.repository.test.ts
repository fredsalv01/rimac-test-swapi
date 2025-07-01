import { PokeApiRepository } from '../src/infrastructure/pokeapi/pokeapi.repository';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokeApiRepository', () => {
  const repo = new PokeApiRepository();

  it('getPokemonTeam devuelve 6 pokémon por personaje', async () => {
    mockedAxios.get.mockResolvedValue({ data: { name: 'pikachu' } });
    const team = await repo.getRandomTeam(6);

    expect(mockedAxios.get).toHaveBeenCalledTimes(6);
    expect(team).toHaveLength(6);
    expect(typeof team[0]).toBe('string');
  });
});