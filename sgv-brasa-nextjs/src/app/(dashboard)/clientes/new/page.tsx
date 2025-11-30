import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClienteForm } from '@/components/clientes/cliente-form'

export default function NewClientePage() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h1>
        <p className="text-muted-foreground">
          Agrega un nuevo cliente a tu base de datos
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClienteForm />
        </CardContent>
      </Card>
    </div>
  )
}
