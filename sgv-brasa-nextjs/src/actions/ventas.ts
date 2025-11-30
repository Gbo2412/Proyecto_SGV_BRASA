'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserId } from '@/lib/auth'
import { ventaSchema, type VentaFormValues } from '@/lib/validations/venta'
import type { Venta } from '@/types'
import type { Database } from '@/types/database.types'

/**
 * Obtener todas las ventas del usuario actual
 */
export async function getVentas(): Promise<{ data: Venta[] | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .eq('user_id', userId)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error fetching ventas:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Venta[], error: null }
  } catch (error) {
    console.error('Error in getVentas:', error)
    return { data: null, error: 'Error al obtener ventas' }
  }
}

/**
 * Obtener una venta por ID
 */
export async function getVenta(id: string): Promise<{ data: Venta | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching venta:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Venta, error: null }
  } catch (error) {
    console.error('Error in getVenta:', error)
    return { data: null, error: 'Error al obtener venta' }
  }
}

/**
 * Crear una nueva venta
 */
export async function createVenta(
  values: VentaFormValues
): Promise<{ data: Venta | null; error: string | null }> {
  try {
    const validatedData = ventaSchema.parse(values)

    const supabase = await createClient()
    const userId = await getCurrentUserId()

    // Obtener información del cliente
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('nombre')
      .eq('id', validatedData.cliente_id)
      .single()

    if (clienteError || !cliente) {
      return { data: null, error: 'Cliente no encontrado' }
    }

    // Obtener información del producto
    const { data: producto, error: productoError } = await supabase
      .from('productos')
      .select('nombre')
      .eq('id', validatedData.producto_id)
      .single()

    if (productoError || !producto) {
      return { data: null, error: 'Producto no encontrado' }
    }

    // Calcular monto de cuota si es pago en cuotas
    const montoCuota =
      validatedData.tipo_pago === 'cuotas' && validatedData.num_cuotas
        ? validatedData.monto_total / validatedData.num_cuotas
        : null

    // Preparar datos para insertar
    const insertData: Database['public']['Tables']['ventas']['Insert'] = {
      user_id: userId,
      cliente_id: validatedData.cliente_id,
      cliente_nombre: cliente.nombre,
      producto_id: validatedData.producto_id,
      producto_nombre: producto.nombre,
      fecha: validatedData.fecha,
      tipo_pago: validatedData.tipo_pago,
      monto_total: validatedData.monto_total,
      num_cuotas: validatedData.num_cuotas || null,
      monto_cuota: montoCuota,
      monto_pagado: validatedData.tipo_pago === 'contado' ? validatedData.monto_total : 0,
      saldo_pendiente:
        validatedData.tipo_pago === 'contado' ? 0 : validatedData.monto_total,
      estado: validatedData.tipo_pago === 'contado' ? 'PAGADO' : 'PENDIENTE',
    }

    const { data, error } = await supabase
      .from('ventas')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Error creating venta:', error)
      return { data: null, error: error.message }
    }

    // Si es venta al contado, crear automáticamente el pago
    if (validatedData.tipo_pago === 'contado') {
      const pagoData: Database['public']['Tables']['pagos']['Insert'] = {
        user_id: userId,
        venta_id: data.id,
        fecha_pago: validatedData.fecha,
        monto: validatedData.monto_total,
        metodo_pago: 'Contado',
        notas: 'Pago al contado generado automáticamente',
      }
      await supabase.from('pagos').insert([pagoData])
    }

    revalidatePath('/ventas')
    return { data: data as Venta, error: null }
  } catch (error) {
    console.error('Error in createVenta:', error)
    if (error instanceof z.ZodError) {
      return { data: null, error: 'Datos inválidos' }
    }
    return { data: null, error: 'Error al crear venta' }
  }
}

/**
 * Actualizar una venta
 */
export async function updateVenta(
  id: string,
  values: VentaFormValues
): Promise<{ data: Venta | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const validatedData = ventaSchema.parse(values)

    // Obtener información del cliente
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('nombre')
      .eq('id', validatedData.cliente_id)
      .single()

    if (clienteError || !cliente) {
      return { data: null, error: 'Cliente no encontrado' }
    }

    // Obtener información del producto
    const { data: producto, error: productoError } = await supabase
      .from('productos')
      .select('nombre')
      .eq('id', validatedData.producto_id)
      .single()

    if (productoError || !producto) {
      return { data: null, error: 'Producto no encontrado' }
    }

    // Calcular monto de cuota si es pago en cuotas
    const montoCuota =
      validatedData.tipo_pago === 'cuotas' && validatedData.num_cuotas
        ? validatedData.monto_total / validatedData.num_cuotas
        : null

    // Preparar datos para actualizar
    const updateData: Database['public']['Tables']['ventas']['Update'] = {
      cliente_id: validatedData.cliente_id,
      cliente_nombre: cliente.nombre,
      producto_id: validatedData.producto_id,
      producto_nombre: producto.nombre,
      fecha: validatedData.fecha,
      tipo_pago: validatedData.tipo_pago,
      monto_total: validatedData.monto_total,
      num_cuotas: validatedData.num_cuotas || null,
      monto_cuota: montoCuota,
    }

    const { data, error } = await supabase
      .from('ventas')
      .update([updateData])
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating venta:', error)
      return { data: null, error: error.message }
    }

    revalidatePath('/ventas')
    revalidatePath(`/ventas/${id}/edit`)
    return { data: data as Venta, error: null }
  } catch (error) {
    console.error('Error in updateVenta:', error)
    if (error instanceof z.ZodError) {
      return { data: null, error: 'Datos inválidos' }
    }
    return { data: null, error: 'Error al actualizar venta' }
  }
}

/**
 * Eliminar una venta
 */
export async function deleteVenta(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { error } = await supabase
      .from('ventas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting venta:', error)
      return { error: error.message }
    }

    revalidatePath('/ventas')
    return { error: null }
  } catch (error) {
    console.error('Error in deleteVenta:', error)
    return { error: 'Error al eliminar venta' }
  }
}
