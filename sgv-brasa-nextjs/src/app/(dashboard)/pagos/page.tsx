import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PagosTable } from '@/components/pagos/pagos-table'
import { getPagos } from '@/actions/pagos'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function PagosPage() {
  const { data: pagos, error } = await getPagos()

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error al cargar los pagos: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
          <p className="text-muted-foreground">
            Registro de pagos realizados a ventas
          </p>
        </div>
        <Link href="/pagos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Pago
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <PagosTable pagos={pagos || []} />
        </CardContent>
      </Card>
    </div>
  )
}
