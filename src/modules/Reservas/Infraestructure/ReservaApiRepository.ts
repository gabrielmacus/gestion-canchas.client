import type ReservaRepository from "../Domain/ReservaRepository"
import { createApiRepository } from "../../SharedKernel/Infraestructure/ApiRepository"
import type { Reserva } from "../Domain/Reserva"

export default function createReservaApiRepository(): ReservaRepository {
    const baseUrl = import.meta.env.VITE_API_URL + '/reservas'

    const apiRepository = createApiRepository<Reserva>(baseUrl)
    return {
        ...apiRepository
    }
} 