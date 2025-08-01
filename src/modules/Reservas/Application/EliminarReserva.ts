import type ReservaRepository from "../Domain/ReservaRepository"

export function EliminarReserva(reservaRepository: ReservaRepository, id: string) {
    return reservaRepository.delete(id)
} 