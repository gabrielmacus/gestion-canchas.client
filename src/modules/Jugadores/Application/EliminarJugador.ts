import type JugadorRepository from "../Domain/JugadorRepository"

export function EliminarJugador(jugadorRepository: JugadorRepository, id: string) {
    return jugadorRepository.delete(id)
}