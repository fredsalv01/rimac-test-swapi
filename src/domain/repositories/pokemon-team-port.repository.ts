export interface PokemonApiPort {
    getRandomTeam(count: number): Promise<string[]>;
}