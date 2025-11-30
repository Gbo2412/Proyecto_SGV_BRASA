'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
import { clienteSchema, type ClienteFormValues } from '@/lib/validations/cliente'
import { createCliente, updateCliente } from '@/actions/clientes'
import type { Cliente } from '@/types'

interface ClienteFormProps {
  cliente?: Cliente
  onSuccess?: () => void
}

export function ClienteForm({ cliente, onSuccess }: ClienteFormProps) {
  const router = useRouter()
  const isEditing = !!cliente

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: cliente?.nombre || '',
      email: cliente?.email || '',
      telefono: cliente?.telefono || '',
      direccion: cliente?.direccion || '',
    },
  })

  async function onSubmit(values: ClienteFormValues) {
    try {
      if (isEditing) {
        const { error } = await updateCliente(cliente.id, values)
        if (error) {
          toast.error(error)
          return
        }
        toast.success('Cliente actualizado correctamente')
      } else {
        const { error } = await createCliente(values)
        if (error) {
          toast.error(error)
          return
        }
        toast.success('Cliente creado correctamente')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/clientes')
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
                <Input placeholder="Nombre del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="999 999 999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Dirección completa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              : 'Crear Cliente'}
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
