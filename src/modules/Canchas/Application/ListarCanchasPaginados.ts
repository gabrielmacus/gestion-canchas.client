import { Cancha } from '../Domain/Cancha';
import { CanchaRepository } from '../Domain/CanchaRepository';
import { PaginatedResponse } from '../../SharedKernel/Domain/PaginatedResponse';
import { Criteria } from '../../SharedKernel/Domain/Criteria';

export class ListarCanchasPaginados {
    constructor(private readonly canchaRepository: CanchaRepository) {}

    async ejecutar(criteria: Criteria): Promise<PaginatedResponse<Cancha>> {
        return await this.canchaRepository.listarPaginado(criteria);
    }
}