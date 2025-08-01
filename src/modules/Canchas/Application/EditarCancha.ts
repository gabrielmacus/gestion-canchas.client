import type CanchaRepository from "../Domain/CanchaRepository"
import type { Cancha } from "../Domain/Cancha"

export default function EditarCancha(canchaRepository: CanchaRepository, cancha: Partial<Cancha>, id: string) {
    return canchaRepository.update(id, cancha)
}