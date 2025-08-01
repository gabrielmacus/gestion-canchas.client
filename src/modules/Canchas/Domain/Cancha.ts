import type BaseEntity from "../../SharedKernel/Domain/BaseEntity";

export interface Cancha extends BaseEntity {
    nombre: string
    techada: boolean
}