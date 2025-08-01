import type JugadorRepository from "../Domain/JugadorRepository";
import type { Jugador } from "../Domain/Jugador";
import CreateEntity from "../../SharedKernel/Domain/CreateEntity";
import { CrearJugadorSchema, type CrearJugadorData } from "./JugadorValidations";

export async function CrearJugador(jugadorRepository: JugadorRepository, jugadorData: CrearJugadorData) {
    // Validar los datos de entrada
    const validatedData = CrearJugadorSchema.parse(jugadorData);
    
    // Convertir los datos validados al tipo esperado por el dominio
    const jugador: Omit<Jugador, 'id'> = {
        nombre: validatedData.nombre,
        apellido: validatedData.apellido,
        telefono: validatedData.telefono,
        email: validatedData.email || null,
    };

    return await CreateEntity(jugadorRepository, jugador);
}