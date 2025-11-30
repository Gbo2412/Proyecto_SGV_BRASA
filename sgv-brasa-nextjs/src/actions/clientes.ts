'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserId } from '@/lib/auth'
import { clienteSchema, type ClienteFormValues } from '@/lib/validations/cliente'
import type { Cliente } from '@/types'

/**
 * Obtener todos los clientes del usuario actual
 */
export async function getClientes(): Promise<{ data: Cliente[] | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clientes:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Cliente[], error: null }
  } catch (error) {
    console.error('Error in getClientes:', error)
    return { data: null, error: 'Error al obtener clientes' }
  }
}

/**
 * Obtener un cliente por ID
 */
export async function getCliente(id: string): Promise<{ data: Cliente | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching cliente:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Cliente, error: null }
  } catch (error) {
    console.error('Error in getCliente:', error)
    return { data: null, error: 'Error al obtener cliente' }
  }
}

/**
 * Crear un nuevo cliente
 */
export async function createCliente(
  values: ClienteFormValues
): Promise<{ data: Cliente | null; error: string | null }> {
  try {
    // Validar datos
    const validatedData = clienteSchema.parse(values)

    const supabase = await createClient()
    const userId = await getCurrentUserId()

    // Preparar datos para insertar
    const insertData = {
      user_id: userId,
      nombre: validatedData.nombre,
      email: validatedData.email || null,
      telefono: validatedData.telefono || null,
      direccion: validatedData.direccion || null,
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating cliente:', error)
      return { data: null, error: error.message }
    }

    revalidatePath('/clientes')
    return { data: data as Cliente, error: null }
  } catch (error) {
    console.error('Error in createCliente:', error)
    if (error instanceof z.ZodError) {
      return { data: null, error: 'Datos inválidos' }
    }
    return { data: null, error: 'Error al crear cliente' }
  }
}

/**
 * Actualizar un cliente existente
 */
export async function updateCliente(
  id: string,
  values: ClienteFormValues
): Promise<{ data: Cliente | null; error: string | null }> {
  try {
    // Validar datos
    const validatedData = clienteSchema.parse(values)

    const supabase = await createClient()
    const userId = await getCurrentUserId()

    // Preparar datos para actualizar
    const updateData = {
      nombre: validatedData.nombre,
      email: validatedData.email || null,
      telefono: validatedData.telefono || null,
      direccion: validatedData.direccion || null,
    }

    const { data, error } = await supabase
      .from('clientes')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating cliente:', error)
      return { data: null, error: error.message }
    }

    revalidatePath('/clientes')
    return { data: data as Cliente, error: null }
  } catch (error) {
    console.error('Error in updateCliente:', error)
    if (error instanceof z.ZodError) {
      return { data: null, error: 'Datos inválidos' }
    }
    return { data: null, error: 'Error al actualizar cliente' }
  }
}

/**
 * Eliminar un cliente
 */
export async function deleteCliente(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting cliente:', error)
      return { error: error.message }
    }

    revalidatePath('/clientes')
    return { error: null }
  } catch (error) {
    console.error('Error in deleteCliente:', error)
    return { error: 'Error al eliminar cliente' }
  }
}
