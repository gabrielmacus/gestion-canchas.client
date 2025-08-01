import { Cancha } from '../Domain/Cancha';
import { CanchaRepository } from '../Domain/CanchaRepository';

export class EditarCancha {
    constructor(private readonly canchaRepository: CanchaRepository) {}

    async ejecutar(id: string, datosCancha: Partial<Cancha>): Promise<Cancha> {
        return await this.canchaRepository.actualizar(id, datosCancha);
    }
}