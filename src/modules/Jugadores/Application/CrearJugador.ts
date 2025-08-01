import type JugadorRepository from "../Domain/JugadorRepository";
import type { Jugador } from "../Domain/Jugador";
import CreateEntity from "../../SharedKernel/Domain/CreateEntity";

export async function CrearJugador(jugadorRepository: JugadorRepository, jugador: Omit<Jugador, 'id'>) {
    return await CreateEntity(jugadorRepository, jugador)
}