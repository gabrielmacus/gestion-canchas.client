import { Cancha } from './Cancha';
import { Criteria } from '../../SharedKernel/Domain/Criteria';
import { PaginatedResponse } from '../../SharedKernel/Domain/PaginatedResponse';

export interface CanchaRepository {
    save(cancha: Cancha): Promise<void>;
    findById(id: string): Promise<Cancha | null>;
    findByCriteria(criteria: Criteria): Promise<PaginatedResponse<Cancha>>;
    delete(id: string): Promise<void>;
}