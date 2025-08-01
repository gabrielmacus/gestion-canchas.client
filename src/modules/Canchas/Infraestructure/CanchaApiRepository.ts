import { Cancha } from '../Domain/Cancha';
import { CanchaRepository } from '../Domain/CanchaRepository';
import { PaginatedResponse } from '../../SharedKernel/Domain/PaginatedResponse';
import { Criteria } from '../../SharedKernel/Domain/Criteria';
import { ApiRepository } from '../../SharedKernel/Infraestructure/ApiRepository';

export class CanchaApiRepository extends ApiRepository implements CanchaRepository {
    private readonly baseUrl = '/api/canchas';

    async crear(cancha: Omit<Cancha, 'id'>): Promise<Cancha> {
        return await this.post<Cancha>(this.baseUrl, cancha);
    }

    async listarPaginado(criteria: Criteria): Promise<PaginatedResponse<Cancha>> {
        const queryParams = this.buildQueryParams(criteria);
        return await this.get<PaginatedResponse<Cancha>>(`${this.baseUrl}?${queryParams}`);
    }

    async obtenerPorId(id: string): Promise<Cancha | null> {
        try {
            return await this.get<Cancha>(`${this.baseUrl}/${id}`);
        } catch (error) {
            return null;
        }
    }

    async actualizar(id: string, cancha: Partial<Cancha>): Promise<Cancha> {
        return await this.put<Cancha>(`${this.baseUrl}/${id}`, cancha);
    }

    async eliminar(id: string): Promise<void> {
        await this.delete(`${this.baseUrl}/${id}`);
    }
}