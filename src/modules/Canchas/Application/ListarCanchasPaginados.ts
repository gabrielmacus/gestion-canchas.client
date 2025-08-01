import { Cancha } from '../Domain/Cancha';
import { CanchaRepository } from '../Domain/CanchaRepository';
import { Criteria } from '../../SharedKernel/Domain/Criteria';
import { PaginatedResponse } from '../../SharedKernel/Domain/PaginatedResponse';

export class ListarCanchasPaginados {
    constructor(private repository: CanchaRepository) {}

    async execute(criteria: Criteria): Promise<PaginatedResponse<Cancha>> {
        return await this.repository.findByCriteria(criteria);
    }
}