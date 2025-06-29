export function getRandomIds(count: number, TOTAL_POKEMON: number): number[] {
    const ids = new Set<number>();
    while (ids.size < count) {
      const id = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
      ids.add(id);
    }
    return [...ids];
  }