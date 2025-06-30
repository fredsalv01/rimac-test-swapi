
import { Character } from "../domain/entities/characters.entity";
import { CharacterRepositoryPort } from "../domain/repositories/character-port.repository";


export class GetAllCharactersUseCase {
    constructor(private characterRepo: CharacterRepositoryPort) {}

    async execute(): Promise<{ data: Character[]; total: number; }> {
        return this.characterRepo.getAll();
    }
}