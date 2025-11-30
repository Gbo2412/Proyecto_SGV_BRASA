'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserId } from '@/lib/auth'
import { productoSchema, type ProductoFormValues } from '@/lib/validations/producto'
import type { Producto } from '@/types'

/**
 * Obtener todos los productos del usuario actual
 */
export async function getProductos(): Promise<{ data: Producto[] | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching productos:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Producto[], error: null }
  } catch (error) {
    console.error('Error in getProductos:', error)
    return { data: null, error: 'Error al obtener productos' }
  }
}

/**
 * Obtener un producto por ID
 */
export async function getProducto(id: string): Promise<{ data: Producto | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching producto:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Producto, error: null }
  } catch (error) {
    console.error('Error in getProducto:', error)
    return { data: null, error: 'Error al obtener producto' }
  }
}

/**
 * Crear un nuevo producto
 */
export async function createProducto(
  values: ProductoFormValues
): Promise<{ data: Producto | null; error: string | null }> {
  try {
    const validatedData = productoSchema.parse(values)

    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const insertData = {
      user_id: userId,
      nombre: validatedData.nombre,
      descripcion: validatedData.descripcion || null,
      precio: validatedData.precio,
      stock: validatedData.stock,
    }

    const { data, error } = await supabase
      .from('productos')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating producto:', error)
      return { data: null, error: error.message }
    }

    revalidatePath('/productos')
    return { data: data as Producto, error: null }
  } catch (error) {
    console.error('Error in createProducto:', error)
    if (error instanceof z.ZodError) {
      return { data: null, error: 'Datos inválidos' }
    }
    return { data: null, error: 'Error al crear producto' }
  }
}

/**
 * Actualizar un producto existente
 */
export async function updateProducto(
  id: string,
  values: ProductoFormValues
): Promise<{ data: Producto | null; error: string | null }> {
  try {
    const validatedData = productoSchema.parse(values)

    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const updateData = {
      nombre: validatedData.nombre,
      descripcion: validatedData.descripcion || null,
      precio: validatedData.precio,
      stock: validatedData.stock,
    }

    const { data, error } = await supabase
      .from('productos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating producto:', error)
      return { data: null, error: error.message }
    }

    revalidatePath('/productos')
    return { data: data as Producto, error: null }
  } catch (error) {
    console.error('Error in updateProducto:', error)
    if (error instanceof z.ZodError) {
      return { data: null, error: 'Datos inválidos' }
    }
    return { data: null, error: 'Error al actualizar producto' }
  }
}

/**
 * Eliminar un producto
 */
export async function deleteProducto(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()
    const userId = await getCurrentUserId()

    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting producto:', error)
      return { error: error.message }
    }

    revalidatePath('/productos')
    return { error: null }
  } catch (error) {
    console.error('Error in deleteProducto:', error)
    return { error: 'Error al eliminar producto' }
  }
}
