import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductoForm } from '@/components/productos/producto-form'

export default function NewProductoPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Producto</h1>
        <p className="text-muted-foreground">
          Agrega un nuevo producto a tu catálogo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductoForm />
        </CardContent>
      </Card>
    </div>
  )
}
