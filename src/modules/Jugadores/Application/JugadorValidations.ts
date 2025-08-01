import { z } from 'zod';

// Validaciones base para campos individuales
const nombreValidation = z
  .string()
  .trim()
  .min(3, "El nombre del jugador debe tener entre 3 y 100 caracteres")
  .max(100, "El nombre del jugador debe tener entre 3 y 100 caracteres");

const apellidoValidation = z
  .string()
  .trim()
  .min(3, "El apellido del jugador debe tener entre 3 y 100 caracteres")
  .max(100, "El apellido del jugador debe tener entre 3 y 100 caracteres");

const telefonoValidation = z
  .string()
  .trim()
  .regex(/^\d+$/, "El teléfono debe contener solo dígitos")
  .min(7, "El teléfono debe tener entre 7 y 15 dígitos")
  .max(15, "El teléfono debe tener entre 7 y 15 dígitos");

const emailValidation = z
  .string()
  .trim()
  .regex(/^[^@]+@[^@]+\.[^@]+$/, "El email no es válido");

// Schema para crear jugador
export const CrearJugadorSchema = z
  .object({
    nombre: nombreValidation,
    apellido: apellidoValidation,
    telefono: telefonoValidation,
    email: emailValidation.optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  })
  .refine(
    (data) => data.email || data.telefono,
    {
      message: "Debe proporcionar al menos un email o un teléfono",
      path: ["email"],
    }
  );

// Schema para editar jugador
export const EditarJugadorSchema = z
  .object({
    nombre: nombreValidation.optional(),
    apellido: apellidoValidation.optional(),
    telefono: telefonoValidation.optional(),
    email: emailValidation.optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  })
  .refine(
    (data) => {
      // Si se proporciona algún campo de contacto, debe haber al menos email o teléfono
      const hasContactField = data.email !== undefined || data.telefono !== undefined;
      if (hasContactField) {
        return data.email || data.telefono;
      }
      return true; // Si no se actualiza ningún campo de contacto, no aplica la validación
    },
    {
      message: "Debe proporcionar al menos un email o un teléfono",
      path: ["email"],
    }
  );

export type CrearJugadorData = z.infer<typeof CrearJugadorSchema>;
export type EditarJugadorData = z.infer<typeof EditarJugadorSchema>;