export function generatePokemonIdsFromName(name: string, count: 6) : number[] {
    const ids = new Set<number>();

  while (ids.size < count) {
    const randomId = Math.floor(Math.random() * 898) + 1; // Pokémon IDs del 1 al 898
    ids.add(randomId);
  }

  return [...ids];
}