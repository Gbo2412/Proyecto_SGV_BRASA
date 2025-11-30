import { createClient } from '@/lib/supabase/server'
import { KPICard } from '@/components/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { DashboardKPIs, UltimaVenta } from '@/types'

async function getDashboardData(): Promise<{
  kpis: DashboardKPIs
  ultimasVentas: UltimaVenta[]
}> {
  const supabase = await createClient()

  // Obtener datos del usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      kpis: {
        totalVentas: 0,
        montoTotal: 0,
        ventasPagadas: 0,
        saldoPendiente: 0,
      },
      ultimasVentas: [],
    }
  }

  // Obtener todas las ventas del usuario
  const { data: ventas, error } = await supabase
    .from('ventas')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false })

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
    }
  }

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

  return {
    kpis: {
      totalVentas,
      montoTotal,
      ventasPagadas,
      saldoPendiente,
    },
    ultimasVentas,
  }
}

export default async function DashboardPage() {
  const { kpis, ultimasVentas } = await getDashboardData()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de tu negocio
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Ventas"
          value={kpis.totalVentas}
          icon={ShoppingCart}
          description={`${kpis.ventasPagadas} ventas completadas`}
          valueColor="default"
        />
        <KPICard
          title="Monto Total"
          value={formatCurrency(kpis.montoTotal)}
          icon={DollarSign}
          description="Valor total de ventas"
          valueColor="default"
        />
        <KPICard
          title="Ventas Pagadas"
          value={kpis.ventasPagadas}
          icon={CheckCircle2}
          description="Ventas completadas"
          valueColor="success"
        />
        <KPICard
          title="Saldo Pendiente"
          value={formatCurrency(kpis.saldoPendiente)}
          icon={AlertCircle}
          description="Por cobrar"
          valueColor="warning"
        />
      </div>

      {/* Últimas Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {ultimasVentas.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              No hay ventas registradas
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasVentas.map((venta) => (
                  <TableRow key={venta.venta_id}>
                    <TableCell className="font-medium">
                      {venta.venta_id}
                    </TableCell>
                    <TableCell>{venta.cliente_nombre}</TableCell>
                    <TableCell>{formatDate(venta.fecha)}</TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      {formatCurrency(venta.monto_total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          venta.estado === 'PAGADO' ? 'default' : 'secondary'
                        }
                        className={
                          venta.estado === 'PAGADO'
                            ? 'bg-success text-success-foreground'
                            : 'bg-warning text-warning-foreground'
                        }
                      >
                        {venta.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
