import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductoForm } from '@/components/productos/producto-form'
import { getProducto } from '@/actions/productos'

interface EditProductoPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductoPage({ params }: EditProductoPageProps) {
  const { id } = await params
  const { data: producto, error } = await getProducto(id)

  if (error || !producto) {
    notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
        <p className="text-muted-foreground">
          Actualiza la información de {producto.nombre}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductoForm producto={producto} />
        </CardContent>
      </Card>
    </div>
  )
}
