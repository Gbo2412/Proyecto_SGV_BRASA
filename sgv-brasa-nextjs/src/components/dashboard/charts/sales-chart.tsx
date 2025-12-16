"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemporalChart } from "./temporal-chart"
import { CategoryChart } from "./category-chart"
import type { VentaPorPeriodo, VentaPorCategoria } from "@/app/(dashboard)/actions"

interface SalesChartProps {
  ventasPorPeriodo: VentaPorPeriodo[]
  ventasPorCategoria: VentaPorCategoria[]
}

export function SalesChart({ ventasPorPeriodo, ventasPorCategoria }: SalesChartProps) {
  const [chartType, setChartType] = useState<"temporal" | "category">("temporal")
  const [period, setPeriod] = useState<"day" | "month" | "year">("day")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={chartType} onValueChange={(v) => setChartType(v as "temporal" | "category")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="temporal">Por Período</TabsTrigger>
            <TabsTrigger value="category">Por Categoría</TabsTrigger>
          </TabsList>

          <TabsContent value="temporal" className="space-y-4">
            {/* Period selector for temporal view */}
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod("day")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === "day"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Por Día
              </button>
              <button
                onClick={() => setPeriod("month")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === "month"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Por Mes
              </button>
              <button
                onClick={() => setPeriod("year")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === "year"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Por Año
              </button>
            </div>
            <TemporalChart data={ventasPorPeriodo} period={period} />
          </TabsContent>

          <TabsContent value="category">
            <CategoryChart data={ventasPorCategoria} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
