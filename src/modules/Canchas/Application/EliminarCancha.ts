import type CanchaRepository from "../Domain/CanchaRepository"

export default function EliminarCancha(canchaRepository: CanchaRepository, id: string) {
    return canchaRepository.delete(id)
}