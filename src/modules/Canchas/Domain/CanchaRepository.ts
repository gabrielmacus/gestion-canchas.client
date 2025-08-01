import { Cancha } from './Cancha';
import { PaginatedResponse } from '../../SharedKernel/Domain/PaginatedResponse';
import { Criteria } from '../../SharedKernel/Domain/Criteria';

export interface CanchaRepository {
    crear(cancha: Omit<Cancha, 'id'>): Promise<Cancha>;
    listarPaginado(criteria: Criteria): Promise<PaginatedResponse<Cancha>>;
    obtenerPorId(id: string): Promise<Cancha | null>;
    actualizar(id: string, cancha: Partial<Cancha>): Promise<Cancha>;
    eliminar(id: string): Promise<void>;
}