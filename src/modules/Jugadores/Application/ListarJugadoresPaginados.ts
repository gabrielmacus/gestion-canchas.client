import type Criteria from "../../SharedKernel/Domain/Criteria"
import type JugadorRepository from "../Domain/JugadorRepository"

export function ListarJugadoresPaginados(jugadorRepository: JugadorRepository, criteria: Criteria) {
    return jugadorRepository.getPaginated(criteria)
}