'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ventaSchema, type VentaFormValues } from '@/lib/validations/venta'
import { createVenta } from '@/actions/ventas'
import { formatCurrency, formatDateForInput } from '@/lib/formatters'
import type { Cliente, Producto } from '@/types'

interface VentaFormProps {
  clientes: Cliente[]
  productos: Producto[]
}

export function VentaForm({ clientes, productos }: VentaFormProps) {
  const router = useRouter()

  const form = useForm<VentaFormValues>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      cliente_id: '',
      producto_id: '',
      fecha: formatDateForInput(new Date()),
      tipo_pago: 'contado',
      monto_total: 0,
      num_cuotas: null,
    },
  })

  const tipoPago = form.watch('tipo_pago')
  const montoTotal = form.watch('monto_total')
  const numCuotas = form.watch('num_cuotas')

  // Calcular monto de cuota automáticamente
  const montoCuota =
    tipoPago === 'cuotas' && numCuotas && montoTotal
      ? montoTotal / numCuotas
      : 0

  // Resetear num_cuotas cuando se cambia a contado
  useEffect(() => {
    if (tipoPago === 'contado') {
      form.setValue('num_cuotas', null)
    }
  }, [tipoPago, form])

  async function onSubmit(values: VentaFormValues) {
    try {
      const { error } = await createVenta(values)
      if (error) {
        toast.error(error)
        return
      }
      toast.success('Venta registrada correctamente')
      router.push('/ventas')
      router.refresh()
    } catch (error) {
      toast.error('Ocurrió un error inesperado')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cliente_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nombre} ({cliente.cliente_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="producto_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productos.map((producto) => (
                      <SelectItem key={producto.id} value={producto.id}>
                        {producto.nombre} - {formatCurrency(Number(producto.precio))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monto_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto Total (S/) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tipo_pago"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Pago *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contado">Al Contado</SelectItem>
                  <SelectItem value="cuotas">En Cuotas</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {tipoPago === 'contado'
                  ? 'El pago se registrará completo automáticamente'
                  : 'Podrás registrar pagos parciales'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {tipoPago === 'cuotas' && (
          <FormField
            control={form.control}
            name="num_cuotas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Cuotas *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2"
                    placeholder="2"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  {montoCuota > 0 && (
                    <span className="font-semibold text-primary">
                      Monto por cuota: {formatCurrency(montoCuota)}
                    </span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex-1"
          >
            {form.formState.isSubmitting
              ? 'Registrando...'
              : 'Registrar Venta'}
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
