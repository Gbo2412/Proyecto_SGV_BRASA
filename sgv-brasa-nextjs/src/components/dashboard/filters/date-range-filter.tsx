"use client"

import { useState } from "react"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DateRangeFilterProps {
  onFilterChange: (dateRange: DateRange | undefined) => void
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const handleApplyFilter = () => {
    onFilterChange(dateRange)
  }

  const handleClearFilter = () => {
    const defaultRange = {
      from: addDays(new Date(), -30),
      to: new Date(),
    }
    setDateRange(defaultRange)
    onFilterChange(defaultRange)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Rango de Fechas
            </label>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApplyFilter} className="flex-1">
              Aplicar Filtros
            </Button>
            <Button onClick={handleClearFilter} variant="outline" className="flex-1">
              Limpiar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
