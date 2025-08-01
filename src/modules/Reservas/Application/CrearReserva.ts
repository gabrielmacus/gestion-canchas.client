import type ReservaRepository from "../Domain/ReservaRepository";
import type { Reserva } from "../Domain/Reserva";
import CreateEntity from "../../SharedKernel/Domain/CreateEntity";
import { CrearReservaSchema, type CrearReservaData } from "./ReservaValidations";

export default async function CrearReserva(reservaRepository: ReservaRepository, reservaData: CrearReservaData) {
    // Validar los datos de entrada
    const validatedData = CrearReservaSchema.parse(reservaData);
    
    // Convertir los datos validados al tipo esperado por el dominio
    const reserva: Omit<Reserva, 'id'> = {
        cancha_id: validatedData.cancha_id,
        jugador_id: validatedData.jugador_id,
        fecha_hora: validatedData.fecha_hora,
        duracion: validatedData.duracion,
    };

    return await CreateEntity(reservaRepository, reserva);
} 