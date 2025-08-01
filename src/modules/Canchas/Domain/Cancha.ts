export interface Cancha {
    id: string;
    nombre: string;
    ubicacion: string;
    caracteristicas: Caracteristicas;
}

interface Caracteristicas {
    tipoSuperficie: string;
    techada: boolean;
    dimensiones: string;
    capacidad: number;
}