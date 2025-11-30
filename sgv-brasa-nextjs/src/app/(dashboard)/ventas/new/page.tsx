import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VentaForm } from '@/components/ventas/venta-form'
import { getClientes } from '@/actions/clientes'
import { getProductos } from '@/actions/productos'

export default async function NewVentaPage() {
  const [{ data: clientes }, { data: productos }] = await Promise.all([
    getClientes(),
    getProductos(),
  ])

  if (!clientes || clientes.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Venta</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              No hay clientes registrados. Por favor, agrega al menos un cliente
              antes de registrar una venta.
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
          <h1 className="text-3xl font-bold tracking-tight">Nueva Venta</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              No hay productos registrados. Por favor, agrega al menos un producto
              antes de registrar una venta.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Venta</h1>
        <p className="text-muted-foreground">
          Registra una nueva venta al contado o en cuotas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <VentaForm clientes={clientes} productos={productos} />
        </CardContent>
      </Card>
    </div>
  )
}
