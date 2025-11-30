/**
 * Configuración temporal de autenticación para desarrollo
 * TODO: Reemplazar con Supabase Auth cuando se implemente autenticación
 */

// User ID temporal para desarrollo
// Este es el user_id del usuario que creaste en Supabase
export const TEMP_USER_ID = 'ed6627dd-aa6a-4f1a-a902-a000d35d2bd7'

/**
 * Obtiene el user_id actual
 * En desarrollo, retorna el TEMP_USER_ID
 * En producción con auth, debería obtenerlo de Supabase Auth
 */
export async function getCurrentUserId(): Promise<string> {
  return TEMP_USER_ID
}
