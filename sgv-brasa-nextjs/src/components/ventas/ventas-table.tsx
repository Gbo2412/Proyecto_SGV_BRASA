'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreHorizontal, Trash2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteVenta } from '@/actions/ventas'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { Venta } from '@/types'

interface VentasTableProps {
  ventas: Venta[]
}

export function VentasTable({ ventas }: VentasTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [ventaToDelete, setVentaToDelete] = useState<Venta | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!ventaToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await deleteVenta(ventaToDelete.id)
      if (error) {
        toast.error(error)
        return
      }

      toast.success('Venta eliminada correctamente')
      router.refresh()
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error('Error al eliminar venta')
    } finally {
      setIsDeleting(false)
      setVentaToDelete(null)
    }
  }

  if (ventas.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No hay ventas registradas</h3>
          <p className="text-sm text-muted-foreground">
            Comienza registrando tu primera venta
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Monto Total</TableHead>
              <TableHead className="text-right">Pagado</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventas.map((venta) => (
              <TableRow key={venta.id}>
                <TableCell className="font-medium">{venta.venta_id}</TableCell>
                <TableCell>{venta.cliente_nombre}</TableCell>
                <TableCell>{venta.producto_nombre}</TableCell>
                <TableCell>{formatDate(venta.fecha)}</TableCell>
                <TableCell className="capitalize">
                  {venta.tipo_pago}
                  {venta.num_cuotas && ` (${venta.num_cuotas}x)`}
                </TableCell>
                <TableCell className="text-right font-bold text-gray-900">
                  {formatCurrency(Number(venta.monto_total))}
                </TableCell>
                <TableCell className="text-right font-semibold text-success">
                  {formatCurrency(Number(venta.monto_pagado))}
                </TableCell>
                <TableCell className="text-right font-semibold text-warning">
                  {formatCurrency(Number(venta.saldo_pendiente))}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={venta.estado === 'PAGADO' ? 'default' : 'secondary'}
                    className={
                      venta.estado === 'PAGADO'
                        ? 'bg-success text-success-foreground'
                        : 'bg-warning text-warning-foreground'
                    }
                  >
                    {venta.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {venta.estado === 'PENDIENTE' && (
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/pagos/new?venta_id=${venta.id}`)
                          }
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Registrar Pago
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setVentaToDelete(venta)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              venta{' '}
              <span className="font-semibold">{ventaToDelete?.venta_id}</span> y
              todos sus pagos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
