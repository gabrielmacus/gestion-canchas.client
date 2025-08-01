import { z } from "zod";
import dayjs from "dayjs";

const EditarReservaSchema = z.object({
    cancha_id: z.string().min(1, 'La cancha es requerida').optional(),
    jugador_id: z.string().min(1, 'El jugador es requerido').optional(),
    fecha_hora: z.string()
        .refine(dateStr => {
            const date = dayjs(dateStr);
            const now = dayjs();
            return date.isAfter(now);
        }, {
            message: "La fecha de la reserva no puede ser menor a la fecha actual"
        })
        .refine(dateStr => {
            const date = dayjs(dateStr);
            const threeMonthsFromNow = dayjs().add(3, 'months');
            return date.isBefore(threeMonthsFromNow);
        }, {
            message: "La fecha no puede ser mayor a 3 meses desde la fecha actual"
        })
        .refine(dateStr => {
            const date = dayjs(dateStr);
            return date.minute() === 0 && date.second() === 0;
        }, {
            message: "La hora de reserva debe ser exacta (minutos y segundos deben ser 0)"
        })
        .transform(str => dayjs(str).utc().format("YYYY-MM-DD HH:mm:ss"))
        .optional(),
    duracion: z.number()
        .refine(val => val > 0, {
            message: "La duración de la reserva no puede ser menor o igual a 0"
        })
        .refine(val => val % 60 === 0, {
            message: "La duración de la reserva debe ser múltiplo de 60 minutos"
        })
        .refine(val => val >= 60, {
            message: "La duración de la reserva debe ser al menos de 1 hora"
        })
        .refine(val => val <= 240, {
            message: "La duración de la reserva no puede ser mayor a 4 horas"
        })
        .optional()
});

export default EditarReservaSchema;