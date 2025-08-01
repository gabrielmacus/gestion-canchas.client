import { z } from "zod";

const JugadorSchema = z.object({
    nombre: z.string()
        .transform(val => val.trim())
        .refine(val => val.length >= 3 && val.length <= 100, {
            message: "El nombre del jugador debe tener entre 3 y 100 caracteres"
        })
        .optional(),
    apellido: z.string()
        .transform(val => val.trim())
        .refine(val => val.length >= 3 && val.length <= 100, {
            message: "El apellido del jugador debe tener entre 3 y 100 caracteres"
        })
        .optional(),
    telefono: z.string()
        .transform(val => val.trim())
        .refine(val => /^\d+$/.test(val), {
            message: "El teléfono debe contener solo dígitos"
        })
        .refine(val => val.length >= 7 && val.length <= 15, {
            message: "El teléfono debe tener entre 7 y 15 dígitos"
        })
        .optional(),
    email: z.string()
        .optional()
        .refine(val => !val || /^[^@]+@[^@]+\.[^@]+$/.test(val), {
            message: "El email no es válido"
        })
}).refine(data => data.email || data.telefono, {
    message: "Debe proporcionar al menos un email o un teléfono",
    path: ["email"] // Mostrar el error en el campo email
});

export default JugadorSchema;