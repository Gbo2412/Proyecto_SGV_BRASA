'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserId } from '@/lib/auth'
import type { DashboardKPIs, UltimaVenta, Venta } from '@/types'

export interface VentaPorPeriodo {
  fecha: string
  categoria: string
  monto: number
}

export interface VentaPorCategoria {
  categoria: string
  monto_total: number
  cantidad: number
}

interface DashboardData {
  kpis: DashboardKPIs
  ultimasVentas: UltimaVenta[]
  ventasPorPeriodo: VentaPorPeriodo[]
  ventasPorCategoria: VentaPorCategoria[]
}

export async function getDashboardData(
  fechaDesde?: string,
  fechaHasta?: string
): Promise<DashboardData> {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  // Construir query base
  let query = supabase
    .from('ventas')
    .select(`
      *,
      productos (
        categoria
      )
    `)
    .eq('user_id', userId)
    .order('fecha', { ascending: false })

  // Aplicar filtros de fecha si existen
  if (fechaDesde) {
    query = query.gte('fecha', fechaDesde)
  }
  if (fechaHasta) {
    query = query.lte('fecha', fechaHasta)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching ventas:', error)
    return {
      kpis: {
        totalVentas: 0,
        montoTotal: 0,
        ventasPagadas: 0,
        saldoPendiente: 0,
      },
      ultimasVentas: [],
      ventasPorPeriodo: [],
      ventasPorCategoria: [],
    }
  }

  const ventas = data as Array<Venta & { productos: { categoria: string } }>

  // Calcular KPIs
  const totalVentas = ventas?.length || 0
  const montoTotal = ventas?.reduce((sum, v) => sum + Number(v.monto_total), 0) || 0
  const ventasPagadas = ventas?.filter((v) => v.estado === 'PAGADO').length || 0
  const saldoPendiente =
    ventas?.reduce((sum, v) => sum + Number(v.saldo_pendiente), 0) || 0

  // Últimas 5 ventas
  const ultimasVentas: UltimaVenta[] = (ventas?.slice(0, 5) || []).map((v) => ({
    venta_id: v.venta_id,
    cliente_nombre: v.cliente_nombre,
    monto_total: Number(v.monto_total),
    fecha: v.fecha,
    estado: v.estado as 'PAGADO' | 'PENDIENTE',
  }))

  // Ventas por período (para gráfico temporal)
  const ventasPorPeriodo: VentaPorPeriodo[] = (ventas || []).map((v) => ({
    fecha: v.fecha,
    categoria: v.productos?.categoria || 'Sin categoría',
    monto: Number(v.monto_total),
  }))

  // Ventas por categoría (para gráfico de categorías)
  const ventasPorCategoriaMap = new Map<string, { monto: number; cantidad: number }>()

  ventas?.forEach((v) => {
    const categoria = v.productos?.categoria || 'Sin categoría'
    const existing = ventasPorCategoriaMap.get(categoria) || { monto: 0, cantidad: 0 }
    ventasPorCategoriaMap.set(categoria, {
      monto: existing.monto + Number(v.monto_total),
      cantidad: existing.cantidad + 1,
    })
  })

  const ventasPorCategoria: VentaPorCategoria[] = Array.from(
    ventasPorCategoriaMap.entries()
  ).map(([categoria, data]) => ({
    categoria,
    monto_total: data.monto,
    cantidad: data.cantidad,
  }))

  return {
    kpis: {
      totalVentas,
      montoTotal,
      ventasPagadas,
      saldoPendiente,
    },
    ultimasVentas,
    ventasPorPeriodo,
    ventasPorCategoria,
  }
}
