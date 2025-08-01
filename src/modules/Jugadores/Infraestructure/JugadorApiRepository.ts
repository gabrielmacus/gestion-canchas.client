import type JugadorRepository from "../Domain/JugadorRepository"
import { createApiRepository } from "../../SharedKernel/Infraestructure/ApiRepository"
import type { Jugador } from "../Domain/Jugador"

interface JugadorApiRepository extends JugadorRepository {
}


export function createJugadorApiRepository(): JugadorApiRepository {
    const baseUrl = import.meta.env.VITE_API_URL + '/jugadores'
    const apiRepository = createApiRepository<Jugador>(baseUrl)
    return {
        ...apiRepository
    }
}