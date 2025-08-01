import type Criteria from "../../SharedKernel/Domain/Criteria"
import type ReservaRepository from "../Domain/ReservaRepository"

export function ListarReservasPaginadas(reservaRepository: ReservaRepository, criteria: Criteria) {
    return reservaRepository.getPaginated(criteria)
} 