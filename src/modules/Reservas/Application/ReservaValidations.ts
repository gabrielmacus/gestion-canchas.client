import { z } from 'zod';

// Función para validar fecha y hora
const fechaHoraValidation = z
  .string()
  .datetime()
  .refine(
    (fecha) => {
      const fechaReserva = new Date(fecha);
      const ahora = new Date();
      return fechaReserva > ahora;
    },
    {
      message: "La fecha de la reserva no puede ser menor a la fecha actual",
    }
  )
  .refine(
    (fecha) => {
      const fechaReserva = new Date(fecha);
      const tresMesesDesdeAhora = new Date();
      tresMesesDesdeAhora.setMonth(tresMesesDesdeAhora.getMonth() + 3);
      return fechaReserva <= tresMesesDesdeAhora;
    },
    {
      message: "La fecha no puede ser mayor a 3 meses desde la fecha actual",
    }
  )
  .refine(
    (fecha) => {
      const fechaReserva = new Date(fecha);
      return fechaReserva.getMinutes() === 0 && fechaReserva.getSeconds() === 0;
    },
    {
      message: "La hora de reserva debe ser exacta (minutos y segundos deben ser 0)",
    }
  );

// Función para validar duración
const duracionValidation = z
  .number()
  .refine(
    (duracion) => duracion > 0,
    {
      message: "La duración de la reserva no puede ser menor o igual a 0",
    }
  )
  .refine(
    (duracion) => duracion % 60 === 0,
    {
      message: "La duración de la reserva debe ser múltiplo de 60 minutos",
    }
  )
  .refine(
    (duracion) => duracion >= 60,
    {
      message: "La duración de la reserva debe ser al menos de 1 hora",
    }
  )
  .refine(
    (duracion) => duracion <= 240,
    {
      message: "La duración de la reserva no puede ser mayor a 4 horas",
    }
  );

// Schema para crear reserva
export const CrearReservaSchema = z.object({
  cancha_id: z.string().min(1, "Debe seleccionar una cancha"),
  jugador_id: z.string().min(1, "Debe seleccionar un jugador"),
  fecha_hora: fechaHoraValidation,
  duracion: duracionValidation,
});

// Schema para editar reserva
export const EditarReservaSchema = z.object({
  cancha_id: z.string().min(1, "Debe seleccionar una cancha").optional(),
  jugador_id: z.string().min(1, "Debe seleccionar un jugador").optional(),
  fecha_hora: fechaHoraValidation.optional(),
  duracion: duracionValidation.optional(),
});

export type CrearReservaData = z.infer<typeof CrearReservaSchema>;
export type EditarReservaData = z.infer<typeof EditarReservaSchema>;