import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VentaForm } from '@/components/ventas/venta-form'
import { getVenta } from '@/actions/ventas'
import { getClientes } from '@/actions/clientes'
import { getProductos } from '@/actions/productos'

interface EditVentaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditVentaPage({ params }: EditVentaPageProps) {
  const { id } = await params
  const [
    { data: venta, error },
    { data: clientes },
    { data: productos },
  ] = await Promise.all([getVenta(id), getClientes(), getProductos()])

  if (error || !venta) {
    notFound()
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Venta</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              No hay clientes registrados. Por favor, agrega al menos un cliente.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Venta</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              No hay productos registrados. Por favor, agrega al menos un producto.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Venta</h1>
        <p className="text-muted-foreground">
          Actualiza la información de la venta {venta.venta_id}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <VentaForm venta={venta} clientes={clientes} productos={productos} />
        </CardContent>
      </Card>
    </div>
  )
}
