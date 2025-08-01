import { CanchaRepository } from '../Domain/CanchaRepository';

export class EliminarCancha {
    constructor(private repository: CanchaRepository) {}

    async execute(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}