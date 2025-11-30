import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PagoForm } from '@/components/pagos/pago-form'
import { getVentas } from '@/actions/ventas'

interface NewPagoPageProps {
  searchParams: Promise<{ venta_id?: string }>
}

export default async function NewPagoPage({ searchParams }: NewPagoPageProps) {
  const params = await searchParams
  const { data: ventas } = await getVentas()

  // Filtrar solo ventas pendientes
  const ventasPendientes = ventas?.filter((v) => v.estado === 'PENDIENTE') || []

  if (ventasPendientes.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registrar Pago</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              No hay ventas pendientes de pago. Todas las ventas están pagadas
              completamente o no hay ventas registradas.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registrar Pago</h1>
        <p className="text-muted-foreground">
          Registra un nuevo pago para una venta pendiente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <PagoForm
            ventasPendientes={ventasPendientes}
            ventaIdFromQuery={params.venta_id}
          />
        </CardContent>
      </Card>
    </div>
  )
}
