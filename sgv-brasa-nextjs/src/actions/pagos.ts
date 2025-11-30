'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserId } from '@/lib/auth'
import { pagoSchema, type PagoFormValues } from '@/lib/validations/pago'
import type { Pago } from '@/types'
import type { Database } from '@/types/database.types'

/**
 * Obtener todos los pagos del usuario actual
 */
export async function getPagos(): Promise<{
  data: Pago[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('pagos')
      .select('*')
      .eq('user_id', userId)
      .order('fecha_pago', { ascending: false })

    if (error) {
      console.error('Error fetching pagos:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Pago[], error: null }
  } catch (error) {
    console.error('Error in getPagos:', error)
    return { data: null, error: 'Error al obtener pagos' }
  }
}

/**
 * Obtener un pago por ID
 */
export async function getPago(
  id: string
): Promise<{ data: Pago | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('pagos')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching pago:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Pago, error: null }
  } catch (error) {
    console.error('Error in getPago:', error)
    return { data: null, error: 'Error al obtener pago' }
  }
}

/**
 * Crear un nuevo pago
 */
export async function createPago(
  values: PagoFormValues
): Promise<{ data: Pago | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const validatedData = pagoSchema.parse(values)

    // Verificar que la venta existe y tiene saldo pendiente
    const { data: venta, error: ventaError } = await supabase
      .from('ventas')
      .select('saldo_pendiente, venta_id')
      .eq('id', validatedData.venta_id)
      .eq('user_id', userId)
      .single()

    if (ventaError || !venta) {
      return { data: null, error: 'Venta no encontrada' }
    }

    if (venta.saldo_pendiente <= 0) {
      return { data: null, error: 'La venta ya está pagada completamente' }
    }

    if (validatedData.monto > venta.saldo_pendiente) {
      return {
        data: null,
        error: `El monto no puede ser mayor al saldo pendiente (S/ ${venta.saldo_pendiente.toFixed(2)})`,
      }
    }

    const insertData: Database['public']['Tables']['pagos']['Insert'] = {
      user_id: userId,
      venta_id: validatedData.venta_id,
      fecha_pago: validatedData.fecha_pago,
      monto: validatedData.monto,
      metodo_pago: validatedData.metodo_pago,
      notas: validatedData.notas || null,
    }

    const { data, error } = await supabase
      .from('pagos')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Error creating pago:', error)
      return { data: null, error: error.message }
    }

    // El trigger update_venta_on_pago se encarga de actualizar la venta automáticamente

    revalidatePath('/pagos')
    revalidatePath('/ventas')
    revalidatePath(`/ventas/${validatedData.venta_id}`)
    return { data: data as Pago, error: null }
  } catch (error) {
    console.error('Error in createPago:', error)
    if (error instanceof z.ZodError) {
      return { data: null, error: 'Datos inválidos' }
    }
    return { data: null, error: 'Error al crear pago' }
  }
}

/**
 * Eliminar un pago
 */
export async function deletePago(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { error } = await supabase
      .from('pagos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting pago:', error)
      return { error: error.message }
    }

    // El trigger se encarga de actualizar la venta automáticamente

    revalidatePath('/pagos')
    revalidatePath('/ventas')
    return { error: null }
  } catch (error) {
    console.error('Error in deletePago:', error)
    return { error: 'Error al eliminar pago' }
  }
}
