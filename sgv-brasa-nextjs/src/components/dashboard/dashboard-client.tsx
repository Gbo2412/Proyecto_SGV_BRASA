"use client"

import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { KPICard } from "@/components/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { DateRangeFilter } from "./filters/date-range-filter"
import { SalesChart } from "./charts/sales-chart"
import { getDashboardData } from "@/app/(dashboard)/actions"
import type { DashboardKPIs, UltimaVenta } from "@/types"
import type { VentaPorPeriodo, VentaPorCategoria } from "@/app/(dashboard)/actions"

interface DashboardClientProps {
  initialData: {
    kpis: DashboardKPIs
    ultimasVentas: UltimaVenta[]
    ventasPorPeriodo: VentaPorPeriodo[]
    ventasPorCategoria: VentaPorCategoria[]
  }
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const handleFilterChange = async (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange)
    setLoading(true)

    try {
      const fechaDesde = newDateRange?.from
        ? format(newDateRange.from, "yyyy-MM-dd")
        : undefined
      const fechaHasta = newDateRange?.to
        ? format(newDateRange.to, "yyyy-MM-dd")
        : undefined

      const newData = await getDashboardData(fechaDesde, fechaHasta)
      setData(newData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de tu negocio
        </p>
      </div>

      {/* Filters */}
      <DateRangeFilter onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Ventas"
          value={data.kpis.totalVentas}
          icon={ShoppingCart}
          description={`${data.kpis.ventasPagadas} ventas completadas`}
          valueColor="default"
        />
        <KPICard
          title="Monto Total"
          value={formatCurrency(data.kpis.montoTotal)}
          icon={DollarSign}
          description="Valor total de ventas"
          valueColor="default"
        />
        <KPICard
          title="Ventas Pagadas"
          value={data.kpis.ventasPagadas}
          icon={CheckCircle2}
          description="Ventas completadas"
          valueColor="success"
        />
        <KPICard
          title="Saldo Pendiente"
          value={formatCurrency(data.kpis.saldoPendiente)}
          icon={AlertCircle}
          description="Por cobrar"
          valueColor="warning"
        />
      </div>

      {/* Charts */}
      <SalesChart
        ventasPorPeriodo={data.ventasPorPeriodo}
        ventasPorCategoria={data.ventasPorCategoria}
      />

      {/* Últimas Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {data.ultimasVentas.length === 0 ? (
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
                {data.ultimasVentas.map((venta) => (
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
