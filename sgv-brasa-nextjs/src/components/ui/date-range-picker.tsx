"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    date || {
      from: addDays(new Date(), -30),
      to: new Date(),
    }
  )

  React.useEffect(() => {
    if (date) {
      setInternalDate(date)
    }
  }, [date])

  const handleDateChange = (newDate: DateRange | undefined) => {
    setInternalDate(newDate)
    onDateChange?.(newDate)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !internalDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate?.from ? (
              internalDate.to ? (
                <>
                  {format(internalDate.from, "dd MMM yyyy", { locale: es })} -{" "}
                  {format(internalDate.to, "dd MMM yyyy", { locale: es })}
                </>
              ) : (
                format(internalDate.from, "dd MMM yyyy", { locale: es })
              )
            ) : (
              <span>Selecciona un rango de fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={internalDate?.from}
            selected={internalDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
