"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { VentaPorCategoria } from "@/app/(dashboard)/actions"

interface CategoryChartProps {
  data: VentaPorCategoria[]
}

// Colores pasteles para las categorías
const CATEGORY_COLORS: Record<string, string> = {
  "Sin categoría": "#cbd5e1",           // Gris claro
  "Creación de contenido": "#93c5fd",   // Azul pastel
  "Asesoría": "#86efac",                // Verde menta pastel
  "Publicidad": "#fda4af",              // Rosa coral pastel
}

export function CategoryChart({ data }: CategoryChartProps) {
  // Función de tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{entry.categoria}</p>
          <p className="text-sm">
            Monto Total: S/ {entry.monto_total.toFixed(2)}
          </p>
          <p className="text-sm">
            Cantidad: {entry.cantidad} {entry.cantidad === 1 ? 'venta' : 'ventas'}
          </p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="categoria"
          angle={-45}
          textAnchor="end"
          height={100}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          tickFormatter={(value) => `S/ ${value}`}
          style={{ fontSize: "12px" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: "20px" }} />
        <Bar
          dataKey="monto_total"
          name="Monto Total"
          radius={[8, 8, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CATEGORY_COLORS[entry.categoria] || "#94a3b8"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
