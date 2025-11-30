import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClienteForm } from '@/components/clientes/cliente-form'
import { getCliente } from '@/actions/clientes'

interface EditClientePageProps {
  params: Promise<{ id: string }>
}

export default async function EditClientePage({ params }: EditClientePageProps) {
  const { id } = await params
  const { data: cliente, error } = await getCliente(id)

  if (error || !cliente) {
    notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Cliente</h1>
        <p className="text-muted-foreground">
          Actualiza la información de {cliente.nombre}
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClienteForm cliente={cliente} />
        </CardContent>
      </Card>
    </div>
  )
}
