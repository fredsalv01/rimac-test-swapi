export class MergeData {
    constructor(
        public readonly name: string,
        public readonly gender: string,
        public readonly height: string,
        public readonly birth_year: string,
        public pokemon_team: string[]
    ){}

    addPokemonNames(pokemon_names: string[]): void {
        this.pokemon_team = pokemon_names;
    }

    toPrimitives() {
        return {
            name: this.name,
            height: this.height,
            gender: this.gender,
            birth_year: this.birth_year,
            pokemon_team: this.pokemon_team
        }
    }

    static fromPrimitives(data: {
        name: string,
        height: string,
        gender: string,
        birth_year: string,
        pokemon_team: string[]
    }): MergeData {
        return new MergeData(
            data.name,
            data.height,
            data.gender,
            data.birth_year,
            data.pokemon_team
        )
    }
}


