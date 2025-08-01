import type ReservaRepository from "../Domain/ReservaRepository";
import type { Reserva } from "../Domain/Reserva";
import { EditarReservaSchema, type EditarReservaData } from "./ReservaValidations";

export default async function EditarReserva(
    reservaRepository: ReservaRepository,
    reservaData: EditarReservaData,
    id: string
) {
    // Validar los datos de entrada
    const validatedData = EditarReservaSchema.parse(reservaData);
    
    // Convertir los datos validados al tipo esperado por el dominio
    const reservaUpdate: Partial<Reserva> = {};
    
    if (validatedData.cancha_id !== undefined) {
        reservaUpdate.cancha_id = validatedData.cancha_id;
    }
    if (validatedData.jugador_id !== undefined) {
        reservaUpdate.jugador_id = validatedData.jugador_id;
    }
    if (validatedData.fecha_hora !== undefined) {
        reservaUpdate.fecha_hora = validatedData.fecha_hora;
    }
    if (validatedData.duracion !== undefined) {
        reservaUpdate.duracion = validatedData.duracion;
    }

    return await reservaRepository.update(id, reservaUpdate);
} 