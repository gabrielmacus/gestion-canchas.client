import { Cancha } from '../Domain/Cancha';
import { CanchaRepository } from '../Domain/CanchaRepository';

export class EditarCancha {
    constructor(private repository: CanchaRepository) {}

    async execute(cancha: Cancha): Promise<void> {
        await this.repository.save(cancha);
    }
}