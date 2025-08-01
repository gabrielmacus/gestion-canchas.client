import type JugadorRepository from "../Domain/JugadorRepository";
import type { Jugador } from "../Domain/Jugador";

export default async function EditarJugador(
    jugadorRepository: JugadorRepository,
    jugador: Partial<Jugador>,
    id: string
) {
    return await jugadorRepository.update(id, jugador)
}