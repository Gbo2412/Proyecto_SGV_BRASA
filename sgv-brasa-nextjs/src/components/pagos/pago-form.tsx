'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pagoSchema, type PagoFormValues } from '@/lib/validations/pago'
import { createPago } from '@/actions/pagos'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency, formatDateForInput } from '@/lib/formatters'
import type { Venta } from '@/types'

interface PagoFormProps {
  ventasPendientes: Venta[]
  ventaIdFromQuery?: string
}

export function PagoForm({ ventasPendientes, ventaIdFromQuery }: PagoFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedVenta, setSelectedVenta] = useState<Venta | undefined>(
    ventaIdFromQuery
      ? ventasPendientes.find((v) => v.id === ventaIdFromQuery)
      : undefined
  )

  const form = useForm<PagoFormValues>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      venta_id: ventaIdFromQuery || '',
      fecha_pago: formatDateForInput(new Date()),
      monto: selectedVenta?.saldo_pendiente || 0,
      metodo_pago: '',
      notas: '',
    },
  })

  const onSubmit = (data: PagoFormValues) => {
    setError(null)
    startTransition(async () => {
      const result = await createPago(data)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/pagos')
        router.refresh()
      }
    })
  }

  const handleVentaChange = (ventaId: string) => {
    const venta = ventasPendientes.find((v) => v.id === ventaId)
    setSelectedVenta(venta)
    if (venta) {
      form.setValue('monto', venta.saldo_pendiente)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="venta_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venta</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  handleVentaChange(value)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una venta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ventasPendientes.map((venta) => (
                    <SelectItem key={venta.id} value={venta.id}>
                      {venta.venta_id} - {venta.cliente_nombre} -{' '}
                      {venta.producto_nombre} - Saldo:{' '}
                      {formatCurrency(venta.saldo_pendiente)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedVenta && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Venta:</span>
              <span className="font-medium">{selectedVenta.venta_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{selectedVenta.cliente_nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Producto:</span>
              <span className="font-medium">{selectedVenta.producto_nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto Total:</span>
              <span className="font-medium">
                {formatCurrency(selectedVenta.monto_total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto Pagado:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(selectedVenta.monto_pagado)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground font-medium">
                Saldo Pendiente:
              </span>
              <span className="font-semibold text-yellow-600">
                {formatCurrency(selectedVenta.saldo_pendiente)}
              </span>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="fecha_pago"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Pago</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto a Pagar</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  disabled={!selectedVenta}
                />
              </FormControl>
              <FormMessage />
              {selectedVenta && (
                <p className="text-sm text-muted-foreground">
                  Máximo: {formatCurrency(selectedVenta.saldo_pendiente)}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metodo_pago"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pago</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona método" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Transferencia">Transferencia</SelectItem>
                  <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="Yape">Yape</SelectItem>
                  <SelectItem value="Plin">Plin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas adicionales sobre el pago"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/pagos')}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending || !selectedVenta}>
            {isPending ? 'Registrando...' : 'Registrar Pago'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
