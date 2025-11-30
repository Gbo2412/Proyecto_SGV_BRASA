export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          cliente_id: string
          user_id: string
          nombre: string
          email: string | null
          telefono: string | null
          direccion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id?: string
          user_id: string
          nombre: string
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          user_id?: string
          nombre?: string
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      productos: {
        Row: {
          id: string
          producto_id: string
          user_id: string
          nombre: string
          descripcion: string | null
          precio: number
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          producto_id?: string
          user_id: string
          nombre: string
          descripcion?: string | null
          precio: number
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          producto_id?: string
          user_id?: string
          nombre?: string
          descripcion?: string | null
          precio?: number
          stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      ventas: {
        Row: {
          id: string
          venta_id: string
          user_id: string
          cliente_id: string
          cliente_nombre: string
          producto_id: string
          producto_nombre: string
          fecha: string
          tipo_pago: 'contado' | 'cuotas'
          monto_total: number
          num_cuotas: number | null
          monto_cuota: number | null
          monto_pagado: number
          saldo_pendiente: number
          estado: 'PAGADO' | 'PENDIENTE'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          venta_id?: string
          user_id: string
          cliente_id: string
          cliente_nombre: string
          producto_id: string
          producto_nombre: string
          fecha: string
          tipo_pago: 'contado' | 'cuotas'
          monto_total: number
          num_cuotas?: number | null
          monto_cuota?: number | null
          monto_pagado?: number
          saldo_pendiente?: number
          estado?: 'PAGADO' | 'PENDIENTE'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          venta_id?: string
          user_id?: string
          cliente_id?: string
          cliente_nombre?: string
          producto_id?: string
          producto_nombre?: string
          fecha?: string
          tipo_pago?: 'contado' | 'cuotas'
          monto_total?: number
          num_cuotas?: number | null
          monto_cuota?: number | null
          monto_pagado?: number
          saldo_pendiente?: number
          estado?: 'PAGADO' | 'PENDIENTE'
          created_at?: string
          updated_at?: string
        }
      }
      pagos: {
        Row: {
          id: string
          pago_id: string
          user_id: string
          venta_id: string
          fecha_pago: string
          monto: number
          metodo_pago: string | null
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pago_id?: string
          user_id: string
          venta_id: string
          fecha_pago: string
          monto: number
          metodo_pago?: string | null
          notas?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pago_id?: string
          user_id?: string
          venta_id?: string
          fecha_pago?: string
          monto?: number
          metodo_pago?: string | null
          notas?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
