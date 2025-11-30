'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { productoSchema, type ProductoFormValues } from '@/lib/validations/producto'
import { createProducto, updateProducto } from '@/actions/productos'
import type { Producto } from '@/types'

interface ProductoFormProps {
  producto?: Producto
  onSuccess?: () => void
}

export function ProductoForm({ producto, onSuccess }: ProductoFormProps) {
  const router = useRouter()
  const isEditing = !!producto

  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: producto?.nombre || '',
      descripcion: producto?.descripcion || '',
      precio: producto?.precio ? Number(producto.precio) : 0,
      stock: producto?.stock || 0,
    },
  })

  async function onSubmit(values: ProductoFormValues) {
    try {
      if (isEditing) {
        const { error } = await updateProducto(producto.id, values)
        if (error) {
          toast.error(error)
          return
        }
        toast.success('Producto actualizado correctamente')
      } else {
        const { error } = await createProducto(values)
        if (error) {
          toast.error(error)
          return
        }
        toast.success('Producto creado correctamente')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/productos')
        router.refresh()
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="precio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (S/) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Precio en soles</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>Unidades disponibles</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex-1"
          >
            {form.formState.isSubmitting
              ? 'Guardando...'
              : isEditing
              ? 'Actualizar'
              : 'Crear Producto'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
