import { Criteria } from "../../SharedKernel/Domain/Criteria";
import { PaginatedResponse } from "../../SharedKernel/Domain/PaginatedResponse";
import { Cancha } from "../Domain/Cancha";
import { CanchaRepository } from "../Domain/CanchaRepository";

export class ListarCanchasPaginados {
    constructor(private repository: CanchaRepository) {}

    async execute(criteria: Criteria): Promise<PaginatedResponse<Cancha>> {
        return await this.repository.searchByCriteria(criteria);
    }
}