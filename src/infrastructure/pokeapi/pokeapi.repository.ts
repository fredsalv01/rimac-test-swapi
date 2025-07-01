import axios from "axios";
import { PokemonApiPort } from "../../domain/repositories/pokemon-team-port.repository";
import { getRandomIds } from "../../shared/functions/GeneratePokemons";


export class PokeApiRepository implements PokemonApiPort {
    private TOTAL_POKEMON = 898;

    async getRandomTeam(count: number): Promise<string[]> {
        try {
            const ids = getRandomIds(count, this.TOTAL_POKEMON);
            const responses = await Promise.all(
                ids.map((id) => axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`))
            );
            if (!responses || responses.length === 0) {
                throw new Error("No Pokémon data received from PokeAPI");
            }
            return responses.map((r) => {
                return `${r.data.name.charAt(0).toUpperCase() + r.data.name.slice(1)}`
            });
        } catch (error) {
            console.error("Error al obtener el equipo de Pokémon de pokeApi:", error);
            throw new Error("Fallo al obtener el equipo de Pokémon de pokeApi");
        }
    }
}
