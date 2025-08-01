import type Repository from "../../SharedKernel/Domain/Repository";
import type { Jugador } from "./Jugador"

export default interface JugadorRepository extends Repository<Jugador> {
}