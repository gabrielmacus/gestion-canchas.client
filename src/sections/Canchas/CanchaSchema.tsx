import { z } from "zod";

export default z.object({
    nombre: z.string()
        .transform(val => val.trim())
        .refine(val => val.length >= 3 && val.length <= 100, {
            message: "El nombre de la cancha debe tener entre 3 y 100 caracteres"
        }),
    techada: z.boolean().default(false)
})