import type CanchaRepository from "../Domain/CanchaRepository"
import type Criteria from "../../SharedKernel/Domain/Criteria"

export default function ListarCanchasPaginadas(canchaRepository: CanchaRepository, criteria: Criteria) {
    return canchaRepository.getPaginated(criteria)
}