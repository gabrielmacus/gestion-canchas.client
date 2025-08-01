import type CanchaRepository from "../Domain/CanchaRepository"
import { createApiRepository } from "../../SharedKernel/Infraestructure/ApiRepository"
import type { Cancha } from "../Domain/Cancha"

export default function createCanchaApiRepository(): CanchaRepository {
    const baseUrl = import.meta.env.VITE_API_URL + '/canchas'

    const apiRepository = createApiRepository<Cancha>(baseUrl)
    return {
        ...apiRepository
    }
}