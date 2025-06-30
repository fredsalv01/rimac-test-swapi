import { MergeData } from "../domain/entities/merge-data.entity";
import { CharacterRepositoryPort } from '../domain/repositories/character-port.repository';
import { PokemonApiPort } from '../domain/repositories/pokemon-team-port.repository';
import pLimit from 'p-limit';

export class GetMergeDataUseCase {
    constructor(
        private readonly characterRepo: CharacterRepositoryPort,
        private readonly pokemonApi: PokemonApiPort
    ){}

    async execute(page = 1, limit = 10): Promise<{
        page: number;
        limit: number;
        totalItems: number;
        data: MergeData[];
    }> {
        const { data: characters, total } = await this.characterRepo.getAll(page, limit);
        const limitConcurrency = pLimit(5);

        const enriched = await Promise.all(
            characters.map((char) =>
                limitConcurrency(async () => {
                    const [team] = await Promise.all([
                        this.pokemonApi.getRandomTeam(6),
                    ]);
                    const pokemonTeam = team.map((pokemon) => pokemon);
                    const mergeData = new MergeData(
                        char.name,
                        char.gender,
                        char.height,
                        char.birthYear,
                        pokemonTeam,
                    );
                    return mergeData;
                })
            )
        );
        return {
            page,
            limit,
            totalItems: total,
            data: enriched
        }
    }
}