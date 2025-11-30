import { Database } from './database.types'

// Tipos de las tablas
export type Cliente = Database['public']['Tables']['clientes']['Row']
export type ClienteInsert = Database['public']['Tables']['clientes']['Insert']
export type ClienteUpdate = Database['public']['Tables']['clientes']['Update']

export type Producto = Database['public']['Tables']['productos']['Row']
export type ProductoInsert = Database['public']['Tables']['productos']['Insert']
export type ProductoUpdate = Database['public']['Tables']['productos']['Update']

export type Venta = Database['public']['Tables']['ventas']['Row']
export type VentaInsert = Database['public']['Tables']['ventas']['Insert']
export type VentaUpdate = Database['public']['Tables']['ventas']['Update']

export type Pago = Database['public']['Tables']['pagos']['Row']
export type PagoInsert = Database['public']['Tables']['pagos']['Insert']
export type PagoUpdate = Database['public']['Tables']['pagos']['Update']

// Tipos para formularios
export type TipoPago = 'contado' | 'cuotas'
export type EstadoVenta = 'PAGADO' | 'PENDIENTE'

// Tipos para KPIs del dashboard
export interface DashboardKPIs {
  totalVentas: number
  montoTotal: number
  ventasPagadas: number
  saldoPendiente: number
}

export interface UltimaVenta {
  venta_id: string
  cliente_nombre: string
  monto_total: number
  fecha: string
  estado: EstadoVenta
}

export interface UltimoPago {
  pago_id: string
  venta_id: string
  monto: number
  fecha_pago: string
  metodo_pago: string | null
}
