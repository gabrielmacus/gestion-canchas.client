import { CanchaRepository } from '../Domain/CanchaRepository';

export class EliminarCancha {
    constructor(private readonly canchaRepository: CanchaRepository) {}

    async ejecutar(id: string): Promise<void> {
        await this.canchaRepository.eliminar(id);
    }
}