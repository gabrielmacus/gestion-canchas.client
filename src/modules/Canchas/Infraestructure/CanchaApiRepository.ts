import { Cancha } from '../Domain/Cancha';
import { CanchaRepository } from '../Domain/CanchaRepository';
import { Criteria } from '../../SharedKernel/Domain/Criteria';
import { PaginatedResponse } from '../../SharedKernel/Domain/PaginatedResponse';
import { ApiRepository } from '../../SharedKernel/Infraestructure/ApiRepository';

export class CanchaApiRepository extends ApiRepository implements CanchaRepository {
    async save(cancha: Cancha): Promise<void> {
        if (cancha.id) {
            await this.put(`/canchas/${cancha.id}`, cancha);
        } else {
            await this.post('/canchas', cancha);
        }
    }

    async findById(id: string): Promise<Cancha | null> {
        return await this.get(`/canchas/${id}`);
    }

    async findByCriteria(criteria: Criteria): Promise<PaginatedResponse<Cancha>> {
        const queryString = this.buildQueryString(criteria);
        return await this.get(`/canchas?${queryString}`);
    }

    async delete(id: string): Promise<void> {
        await this.delete(`/canchas/${id}`);
    }
}