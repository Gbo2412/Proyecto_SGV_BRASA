import { z } from 'zod'

export const pagoSchema = z.object({
  venta_id: z.string().min(1, 'Selecciona una venta'),
  fecha_pago: z.string().min(1, 'La fecha es obligatoria'),
  monto: z.coerce.number().positive('El monto debe ser mayor a 0').multipleOf(0.01),
  metodo_pago: z.string().min(1, 'El método de pago es obligatorio'),
  notas: z.string().optional().or(z.literal('')),
})

export type PagoFormValues = z.infer<typeof pagoSchema>
