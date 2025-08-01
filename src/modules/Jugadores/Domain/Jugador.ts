import type BaseEntity from "../../SharedKernel/Domain/BaseEntity";

export interface Jugador extends BaseEntity {
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string | null;
}

