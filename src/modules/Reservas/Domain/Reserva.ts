import type BaseEntity from "../../SharedKernel/Domain/BaseEntity";

export interface Reserva extends BaseEntity {
    cancha_id: string;
    jugador_id: string;
    fecha_hora: string;
    duracion: number;
}