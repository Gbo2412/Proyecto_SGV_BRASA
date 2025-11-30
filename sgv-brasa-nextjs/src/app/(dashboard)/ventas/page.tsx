import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VentasTable } from '@/components/ventas/ventas-table'
import { getVentas } from '@/actions/ventas'

export default async function VentasPage() {
  const { data: ventas, error } = await getVentas()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">
            Registra y gestiona tus ventas
          </p>
        </div>
        <Button asChild>
          <Link href="/ventas/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Venta
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {ventas && <VentasTable ventas={ventas} />}
    </div>
  )
}
