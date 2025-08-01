import { Cancha } from '../Domain/Cancha';
import { CanchaRepository } from '../Domain/CanchaRepository';

export class CrearCancha {
    constructor(private readonly canchaRepository: CanchaRepository) {}

    async ejecutar(datosCancha: Omit<Cancha, 'id'>): Promise<Cancha> {
        return await this.canchaRepository.crear(datosCancha);
    }
}