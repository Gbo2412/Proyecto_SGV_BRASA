"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import type { VentaPorPeriodo } from "@/app/(dashboard)/actions"

interface TemporalChartProps {
  data: VentaPorPeriodo[]
  period: "day" | "month" | "year"
}

// Colores pasteles para las categorías
const CATEGORY_COLORS: Record<string, string> = {
  "Sin categoría": "#cbd5e1",           // Gris claro
  "Creación de contenido": "#93c5fd",   // Azul pastel
  "Asesoría": "#86efac",                // Verde menta pastel
  "Publicidad": "#fda4af",              // Rosa coral pastel
}

export function TemporalChart({ data, period }: TemporalChartProps) {
  const chartData = useMemo(() => {
    // Agrupar datos por período y categoría
    const groupedData = new Map<string, Record<string, number>>()

    data.forEach((venta) => {
      const date = parseISO(venta.fecha)
      let key: string

      // Formatear fecha según el período
      if (period === "day") {
        key = format(date, "dd MMM", { locale: es })
      } else if (period === "month") {
        key = format(date, "MMM yyyy", { locale: es })
      } else {
        key = format(date, "yyyy", { locale: es })
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, {})
      }

      const periodData = groupedData.get(key)!
      const categoria = venta.categoria || "Sin categoría"
      periodData[categoria] = (periodData[categoria] || 0) + venta.monto
    })

    // Convertir a array y ordenar por fecha
    return Array.from(groupedData.entries())
      .map(([fecha, categorias]) => ({
        fecha,
        ...categorias,
      }))
      .sort((a, b) => {
        // Ordenar por fecha
        if (period === "day") {
          return a.fecha.localeCompare(b.fecha)
        }
        return a.fecha.localeCompare(b.fecha)
      })
  }, [data, period])

  // Obtener todas las categorías únicas
  const categorias = useMemo(() => {
    const categoriasSet = new Set<string>()
    data.forEach((venta) => {
      categoriasSet.add(venta.categoria || "Sin categoría")
    })
    return Array.from(categoriasSet)
  }, [data])

  // Función de tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: S/ {entry.value.toFixed(2)}
            </p>
          ))}
          <p className="font-bold mt-2 pt-2 border-t">
            Total: S/ {total.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="fecha"
          angle={-45}
          textAnchor="end"
          height={80}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          tickFormatter={(value) => `S/ ${value}`}
          style={{ fontSize: "12px" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="rect"
        />
        {categorias.map((categoria) => (
          <Bar
            key={categoria}
            dataKey={categoria}
            stackId="a"
            fill={CATEGORY_COLORS[categoria] || "#94a3b8"}
            name={categoria}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
