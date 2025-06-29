import { MergeData } from "../domain/entities/merge-data.entity";
import { CharacterRepositoryPort } from '../domain/repositories/character-port.repository';
import { PokemonApiPort } from '../domain/repositories/pokemon-team-port.repository';

export class GetMergeDataUseCase {
    constructor(
        private readonly characterRepo: CharacterRepositoryPort,
        private readonly pokemonApi: PokemonApiPort
    ){}

    async execute(): Promise<MergeData[]>{
        const characters = await this.characterRepo.getAll();
        return await Promise.all(
            characters.map(async (character) => {
                const pokemonTeam = await this.pokemonApi.getRandomTeam(1);
                const mergeData = new MergeData(
                    character.name,
                    character.gender,
                    character.height,
                    character.birthYear,
                    pokemonTeam,
                );
                return mergeData;
            })
        )
    }
}