export interface Jugador {
    id: string;
    nombre: string;
    apellido: string;
    contacto: Contacto;
}

interface Contacto {
    telefono: string;
    email: string;
}