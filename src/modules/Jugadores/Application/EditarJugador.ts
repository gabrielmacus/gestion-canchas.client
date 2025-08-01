import type JugadorRepository from "../Domain/JugadorRepository";
import type { Jugador } from "../Domain/Jugador";
import { EditarJugadorSchema, type EditarJugadorData } from "./JugadorValidations";

export default async function EditarJugador(
    jugadorRepository: JugadorRepository,
    jugadorData: EditarJugadorData,
    id: string
) {
    // Validar los datos de entrada
    const validatedData = EditarJugadorSchema.parse(jugadorData);
    
    // Convertir los datos validados al tipo esperado por el dominio
    const jugadorUpdate: Partial<Jugador> = {};
    
    if (validatedData.nombre !== undefined) {
        jugadorUpdate.nombre = validatedData.nombre;
    }
    if (validatedData.apellido !== undefined) {
        jugadorUpdate.apellido = validatedData.apellido;
    }
    if (validatedData.telefono !== undefined) {
        jugadorUpdate.telefono = validatedData.telefono;
    }
    if (validatedData.email !== undefined) {
        jugadorUpdate.email = validatedData.email || null;
    }

    return await jugadorRepository.update(id, jugadorUpdate);
}