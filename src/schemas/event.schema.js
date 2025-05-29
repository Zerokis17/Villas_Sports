import { z } from "zod";

export const createEventSchema = z.object({
  nombreEvento: z.string({
    required_error: "Nombre del evento es requerido",
  }),
  tipoEvento: z.string({
    required_error: "Tipo de evento es requerido",
  }),
  ubicacion: z.string({
    required_error: "Ubicación es requerida",
  }),
  fechaHora: z.coerce.date({
    required_error: "La fecha y hora es requerida",
    invalid_type_error: "Fecha y hora debe ser una fecha valida",
  }),
});

//Añadir el resto para los demas metodos