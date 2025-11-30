import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  valueColor?: 'default' | 'success' | 'warning' | 'primary'
  trend?: {
    value: number
    label: string
  }
}

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  valueColor = 'default',
  trend,
}: KPICardProps) {
  const valueColorClass = {
    default: 'text-gray-900', // Negro para valores generales (según MVP feedback)
    success: 'text-success', // Verde para montos pagados
    warning: 'text-warning', // Amarillo para pendientes
    primary: 'text-primary', // Azul para brand
  }[valueColor]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', valueColorClass)}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                'text-xs font-medium',
                trend.value > 0 ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
