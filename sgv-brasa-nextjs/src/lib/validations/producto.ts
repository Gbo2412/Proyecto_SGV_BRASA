import { z } from 'zod'

export const productoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional().or(z.literal('')),
  precio: z.coerce
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .positive('El precio debe ser mayor a 0')
    .multipleOf(0.01, 'El precio debe tener máximo 2 decimales'),
  stock: z.coerce
    .number({ invalid_type_error: 'El stock debe ser un número' })
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo')
    .default(0),
})

export type ProductoFormValues = z.infer<typeof productoSchema>
