/**
 * Formatea un número como moneda en soles peruanos
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formatea una fecha en formato dd/mm/yyyy
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Formatea una fecha en formato ISO para inputs de tipo date
 */
export function formatDateForInput(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

/**
 * Formatea una fecha en formato legible (ej: "30 de noviembre, 2025")
 */
export function formatDateLong(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}
