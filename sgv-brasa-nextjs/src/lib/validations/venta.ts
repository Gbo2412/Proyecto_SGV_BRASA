import { z } from 'zod'

export const ventaSchema = z.object({
  cliente_id: z.string().min(1, 'Selecciona un cliente'),
  producto_id: z.string().min(1, 'Selecciona un producto'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  tipo_pago: z.enum(['contado', 'cuotas'], {
    required_error: 'Selecciona un tipo de pago',
  }),
  monto_total: z.coerce
    .number({ invalid_type_error: 'El monto debe ser un número' })
    .positive('El monto debe ser mayor a 0')
    .multipleOf(0.01, 'El monto debe tener máximo 2 decimales'),
  num_cuotas: z.coerce
    .number()
    .int('El número de cuotas debe ser un entero')
    .min(2, 'Mínimo 2 cuotas')
    .optional()
    .nullable(),
})

export type VentaFormValues = z.infer<typeof ventaSchema>
