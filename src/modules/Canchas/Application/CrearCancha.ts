import type CanchaRepository from "../Domain/CanchaRepository"
import type { Cancha } from "../Domain/Cancha"
import CreateEntity from "../../SharedKernel/Domain/CreateEntity"

export default function CrearCancha(canchaRepository: CanchaRepository, cancha: Omit<Cancha, 'id'>) {
    return CreateEntity(canchaRepository, cancha)
}