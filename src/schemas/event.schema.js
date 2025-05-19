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
  hora: z.coerce.date({
    required_error: "Hora es requerida",
    invalid_type_error: "Hora debe ser una fecha valida",
  }),
  fecha: z.coerce.date({
    required_error: "Fecha es requerida",
    invalid_type_error: "Fecha debe ser una fecha valida",
  }),
});
