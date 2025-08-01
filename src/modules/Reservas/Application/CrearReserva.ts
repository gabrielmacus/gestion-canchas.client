import type ReservaRepository from "../Domain/ReservaRepository";
import type { Reserva } from "../Domain/Reserva";
import CreateEntity from "../../SharedKernel/Domain/CreateEntity";

export default async function CrearReserva(reservaRepository: ReservaRepository, reserva: Omit<Reserva, 'id'>) {
    return await CreateEntity(reservaRepository, reserva)
} 