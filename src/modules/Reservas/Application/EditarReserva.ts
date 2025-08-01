import type ReservaRepository from "../Domain/ReservaRepository";
import type { Reserva } from "../Domain/Reserva";

export default async function EditarReserva(
    reservaRepository: ReservaRepository,
    reserva: Partial<Reserva>,
    id: string
) {
    return await reservaRepository.update(id, reserva)
} 