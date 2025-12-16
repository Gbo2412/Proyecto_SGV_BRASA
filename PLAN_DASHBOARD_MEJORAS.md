# Plan de Implementación: Dashboard Mejorado
**Sistema de Gestión de Ventas BRASA - Next.js**

Fecha: 15/12/2025
Basado en: Mejoras implementadas en MVP HTML

---

## 📋 Resumen Ejecutivo

Portar las mejoras del dashboard del MVP HTML al proyecto Next.js con las siguientes funcionalidades:

✅ **Filtros por fecha dinámicos** (desde/hasta)
✅ **Gráficos de barras apiladas** por categoría de producto
✅ **Toggle entre vistas** (temporal vs categoría)
✅ **Tooltips mejorados** con detalles y totales
✅ **Leyenda interactiva**
✅ **Eje X dinámico** según filtros aplicados

---

## 🎯 Objetivos

1. **Mejorar análisis de ventas** con filtrado temporal preciso
2. **Visualizar distribución por categoría** en cada período
3. **Mantener arquitectura Next.js** (Server Components + Server Actions)
4. **Usar Recharts** (según PRD de arquitectura)
5. **Seguir design system** de shadcn/ui

---

## 📦 Stack Tecnológico a Usar

```json
{
  "frontend": {
    "framework": "Next.js 14 (App Router)",
    "ui": "shadcn/ui + Tailwind CSS",
    "charts": "recharts ^2.10.0",
    "forms": "react-hook-form + zod",
    "icons": "lucide-react"
  },
  "backend": {
    "orm": "Drizzle ORM",
    "database": "Supabase PostgreSQL",
    "pattern": "Server Actions + Server Components"
  }
}
```

---

## 🗂️ Estructura de Archivos

```
sgv-brasa-nextjs/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── page.tsx                    [MODIFICAR] - Dashboard principal
│   │   └── actions/
│   │       └── dashboard.ts                [MODIFICAR] - Agregar filtros de fecha
│   ├── components/
│   │   ├── ui/
│   │   │   ├── date-picker.tsx             [CREAR] - shadcn date picker
│   │   │   └── date-range-picker.tsx       [CREAR] - Selector de rango
│   │   └── dashboard/
│   │       ├── filters/
│   │       │   └── date-range-filter.tsx   [CREAR] - Componente de filtros
│   │       ├── charts/
│   │       │   ├── ventas-temporal-chart.tsx    [CREAR] - Barras apiladas temporal
│   │       │   ├── ventas-categoria-chart.tsx   [CREAR] - Barras por categoría
│   │       │   └── chart-toggle.tsx             [CREAR] - Toggle de vistas
│   │       └── kpi-card.tsx                [EXISTENTE] - Revisar si actualizar
│   ├── lib/
│   │   └── db/
│   │       └── queries/
│   │           └── dashboard.ts            [MODIFICAR] - Queries con filtros
│   └── types/
│       └── dashboard.ts                    [MODIFICAR] - Tipos para filtros y gráficos
```

---

## 📝 Plan de Implementación Detallado

### **FASE 1: Setup de Componentes UI**
_Duración: 1-2 horas_

#### 1.1 Instalar shadcn/ui Date Picker
```bash
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
```

#### 1.2 Crear Date Range Picker Component
**Archivo:** `components/ui/date-range-picker.tsx`

```tsx
'use client';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, 'dd/MM/yyyy', { locale: es })} -{' '}
                {format(value.to, 'dd/MM/yyyy', { locale: es })}
              </>
            ) : (
              format(value.from, 'dd/MM/yyyy', { locale: es })
            )
          ) : (
            <span>Seleccionar rango de fechas</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
```

#### 1.3 Crear Componente de Filtros
**Archivo:** `components/dashboard/filters/date-range-filter.tsx`

```tsx
'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DateRangeFilterProps {
  onFilterChange: (from: Date | undefined, to: Date | undefined) => void;
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleApply = () => {
    onFilterChange(dateRange?.from, dateRange?.to);
  };

  const handleClear = () => {
    setDateRange(undefined);
    onFilterChange(undefined, undefined);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Filtros</h3>
      <div className="flex items-end gap-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <Button onClick={handleApply}>Aplicar Filtros</Button>
        <Button variant="outline" onClick={handleClear}>
          Limpiar
        </Button>
      </div>
    </Card>
  );
}
```

---

### **FASE 2: Actualizar Queries y Server Actions**
_Duración: 2-3 horas_

#### 2.1 Actualizar Tipos
**Archivo:** `types/dashboard.ts`

```typescript
export interface DashboardFilters {
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface VentasPorPeriodo {
  fecha: string;
  categorias: Record<string, number>; // { "Parrillas": 1200, "Catering": 800 }
}

export interface VentasPorCategoria {
  categoria: string;
  monto: number;
  cantidad: number;
}

export type VistaGrafico = 'temporal' | 'categoria';
export type PeriodoTemporal = 'dia' | 'mes' | 'año';
```

#### 2.2 Modificar Queries de Dashboard
**Archivo:** `lib/db/queries/dashboard.ts`

```typescript
import { db } from '@/lib/db';
import { ventas, productos } from '@/lib/db/schema';
import { and, eq, between, gte, lte, sql } from 'drizzle-orm';
import { DashboardFilters, VentasPorPeriodo } from '@/types/dashboard';

export async function getVentasPorDiaConCategorias(
  userId: string,
  filters: DashboardFilters
): Promise<VentasPorPeriodo[]> {
  const conditions = [eq(ventas.user_id, userId)];

  if (filters.fechaDesde && filters.fechaHasta) {
    conditions.push(between(ventas.fecha, filters.fechaDesde, filters.fechaHasta));
  } else if (filters.fechaDesde) {
    conditions.push(gte(ventas.fecha, filters.fechaDesde));
  } else if (filters.fechaHasta) {
    conditions.push(lte(ventas.fecha, filters.fechaHasta));
  }

  const result = await db
    .select({
      fecha: sql<string>`DATE(${ventas.fecha})`,
      categoria: productos.categoria,
      monto_total: sql<number>`SUM(${ventas.monto_total})`,
    })
    .from(ventas)
    .innerJoin(productos, eq(ventas.producto_id, productos.id))
    .where(and(...conditions))
    .groupBy(sql`DATE(${ventas.fecha})`, productos.categoria)
    .orderBy(sql`DATE(${ventas.fecha})`);

  // Transformar a estructura agrupada
  const ventasAgrupadas: Map<string, Record<string, number>> = new Map();

  result.forEach(row => {
    const fecha = row.fecha;
    const categoria = row.categoria || 'Sin categoría';

    if (!ventasAgrupadas.has(fecha)) {
      ventasAgrupadas.set(fecha, {});
    }

    ventasAgrupadas.get(fecha)![categoria] = row.monto_total;
  });

  return Array.from(ventasAgrupadas.entries()).map(([fecha, categorias]) => ({
    fecha,
    categorias,
  }));
}

export async function getVentasPorCategoria(
  userId: string,
  filters: DashboardFilters
): Promise<VentasPorCategoria[]> {
  const conditions = [eq(ventas.user_id, userId)];

  if (filters.fechaDesde && filters.fechaHasta) {
    conditions.push(between(ventas.fecha, filters.fechaDesde, filters.fechaHasta));
  } else if (filters.fechaDesde) {
    conditions.push(gte(ventas.fecha, filters.fechaDesde));
  } else if (filters.fechaHasta) {
    conditions.push(lte(ventas.fecha, filters.fechaHasta));
  }

  const result = await db
    .select({
      categoria: sql<string>`COALESCE(${productos.categoria}, 'Sin categoría')`,
      monto: sql<number>`SUM(${ventas.monto_total})`,
      cantidad: sql<number>`COUNT(*)`,
    })
    .from(ventas)
    .innerJoin(productos, eq(ventas.producto_id, productos.id))
    .where(and(...conditions))
    .groupBy(productos.categoria)
    .orderBy(sql`SUM(${ventas.monto_total}) DESC`);

  return result.map(row => ({
    categoria: row.categoria,
    monto: row.monto,
    cantidad: row.cantidad,
  }));
}
```

#### 2.3 Actualizar Server Actions
**Archivo:** `app/actions/dashboard.ts`

```typescript
'use server';

import { getCurrentUserId } from '@/lib/auth';
import { getVentasPorDiaConCategorias, getVentasPorCategoria } from '@/lib/db/queries/dashboard';
import { DashboardFilters } from '@/types/dashboard';

export async function getDashboardVentasPorDia(filters: DashboardFilters) {
  const userId = await getCurrentUserId();
  return await getVentasPorDiaConCategorias(userId, filters);
}

export async function getDashboardVentasPorCategoria(filters: DashboardFilters) {
  const userId = await getCurrentUserId();
  return await getVentasPorCategoria(userId, filters);
}
```

---

### **FASE 3: Crear Componentes de Gráficos**
_Duración: 3-4 horas_

#### 3.1 Gráfico de Barras Apiladas Temporal
**Archivo:** `components/dashboard/charts/ventas-temporal-chart.tsx`

```tsx
'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { VentasPorPeriodo } from '@/types/dashboard';

interface VentasTemporalChartProps {
  data: VentasPorPeriodo[];
}

const COLORES = [
  '#0ea5e9', // Azul
  '#ec4899', // Rosa
  '#22c55e', // Verde
  '#fb923c', // Naranja
  '#a855f7', // Morado
  '#eab308', // Amarillo
  '#ef4444', // Rojo
  '#3b82f6', // Azul claro
];

export function VentasTemporalChart({ data }: VentasTemporalChartProps) {
  // Obtener todas las categorías únicas
  const categorias = useMemo(() => {
    const catSet = new Set<string>();
    data.forEach(item => {
      Object.keys(item.categorias).forEach(cat => catSet.add(cat));
    });
    return Array.from(catSet);
  }, [data]);

  // Transformar datos para Recharts
  const chartData = useMemo(() => {
    return data.map(item => ({
      fecha: new Date(item.fecha).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit'
      }),
      ...item.categorias,
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.fecha}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: S/ {entry.value.toFixed(2)}
            </p>
          ))}
          <p className="text-sm font-bold mt-2 border-t pt-1">
            Total: S/ {total.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis
          tickFormatter={(value) => `S/ ${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
        />
        {categorias.map((categoria, index) => (
          <Bar
            key={categoria}
            dataKey={categoria}
            stackId="a"
            fill={COLORES[index % COLORES.length]}
            radius={index === categorias.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
```

#### 3.2 Gráfico por Categoría
**Archivo:** `components/dashboard/charts/ventas-categoria-chart.tsx`

```tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { VentasPorCategoria } from '@/types/dashboard';

interface VentasCategoriaChartProps {
  data: VentasPorCategoria[];
}

const COLORES = [
  '#0ea5e9', '#ec4899', '#22c55e', '#fb923c',
  '#a855f7', '#eab308', '#ef4444', '#3b82f6',
];

export function VentasCategoriaChart({ data }: VentasCategoriaChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORES[index % COLORES.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="categoria" />
        <YAxis tickFormatter={(value) => `S/ ${value}`} />
        <Tooltip
          formatter={(value: number) => `S/ ${value.toFixed(2)}`}
        />
        <Bar dataKey="monto" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

#### 3.3 Toggle de Vistas
**Archivo:** `components/dashboard/charts/chart-toggle.tsx`

```tsx
'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VistaGrafico } from '@/types/dashboard';

interface ChartToggleProps {
  value: VistaGrafico;
  onChange: (value: VistaGrafico) => void;
}

export function ChartToggle({ value, onChange }: ChartToggleProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as VistaGrafico)}>
      <TabsList>
        <TabsTrigger value="temporal">Por Período</TabsTrigger>
        <TabsTrigger value="categoria">Por Categoría</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

---

### **FASE 4: Integrar en Dashboard Principal**
_Duración: 1-2 horas_

#### 4.1 Actualizar Dashboard Page
**Archivo:** `app/(dashboard)/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { Card } from '@/components/ui/card';
import { DateRangeFilter } from '@/components/dashboard/filters/date-range-filter';
import { VentasTemporalChart } from '@/components/dashboard/charts/ventas-temporal-chart';
import { VentasCategoriaChart } from '@/components/dashboard/charts/ventas-categoria-chart';
import { ChartToggle } from '@/components/dashboard/charts/chart-toggle';
import { getDashboardVentasPorDia, getDashboardVentasPorCategoria } from '@/app/actions/dashboard';
import { VistaGrafico, DashboardFilters } from '@/types/dashboard';

export default function DashboardPage() {
  const [vista, setVista] = useState<VistaGrafico>('temporal');
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [dataTemporal, setDataTemporal] = useState([]);
  const [dataCategoria, setDataCategoria] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters]);

  async function loadData() {
    setLoading(true);
    try {
      const [temporal, categoria] = await Promise.all([
        getDashboardVentasPorDia(filters),
        getDashboardVentasPorCategoria(filters),
      ]);
      setDataTemporal(temporal);
      setDataCategoria(categoria);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (from: Date | undefined, to: Date | undefined) => {
    setFilters({ fechaDesde: from, fechaHasta: to });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Filtros */}
      <DateRangeFilter onFilterChange={handleFilterChange} />

      {/* KPIs - Existente */}
      {/* ... */}

      {/* Gráfico de Ventas */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {vista === 'temporal' ? 'Ventas por Período' : 'Ventas por Categoría de Producto'}
          </h3>
          <ChartToggle value={vista} onChange={setVista} />
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <p>Cargando...</p>
          </div>
        ) : vista === 'temporal' ? (
          <VentasTemporalChart data={dataTemporal} />
        ) : (
          <VentasCategoriaChart data={dataCategoria} />
        )}
      </Card>

      {/* Resto del dashboard... */}
    </div>
  );
}
```

---

## ✅ Checklist de Implementación

### Fase 1: Setup UI
- [ ] Instalar shadcn/ui calendar y popover
- [ ] Crear DateRangePicker component
- [ ] Crear DateRangeFilter component
- [ ] Probar componentes aisladamente

### Fase 2: Backend
- [ ] Actualizar tipos en types/dashboard.ts
- [ ] Crear queries con filtros en lib/db/queries/dashboard.ts
- [ ] Actualizar server actions en app/actions/dashboard.ts
- [ ] Probar queries en Supabase

### Fase 3: Gráficos
- [ ] Crear VentasTemporalChart (barras apiladas)
- [ ] Crear VentasCategoriaChart
- [ ] Crear ChartToggle
- [ ] Personalizar tooltips
- [ ] Probar con datos de ejemplo

### Fase 4: Integración
- [ ] Integrar en app/(dashboard)/page.tsx
- [ ] Conectar filtros con queries
- [ ] Agregar loading states
- [ ] Manejar casos edge (sin datos, errores)

### Fase 5: Testing y Refinamiento
- [ ] Probar con datos reales
- [ ] Verificar responsive design
- [ ] Ajustar colores según design system
- [ ] Optimizar performance
- [ ] Agregar error handling

---

## 🎨 Consideraciones de Diseño

### Colores de Categorías
Usar paleta consistente del PRD:
```typescript
const COLORES = [
  '#0ea5e9', // Azul (brand)
  '#ec4899', // Rosa
  '#22c55e', // Verde
  '#fb923c', // Naranja
  '#a855f7', // Morado
  '#eab308', // Amarillo
  '#ef4444', // Rojo
  '#3b82f6', // Azul claro
];
```

### Formato de Moneda
```typescript
const formatCurrency = (value: number) => {
  return `S/ ${value.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};
```

### Formato de Fecha
```typescript
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
```

---

## 🚀 Performance

### Optimizaciones
1. **Queries Eficientes:**
   - Usar índices en `fecha` y `user_id`
   - Agregaciones en BD (no en frontend)
   - LIMIT en queries cuando sea posible

2. **Caching:**
   - React Query para cache de datos
   - Revalidar al crear venta/pago

3. **Loading States:**
   - Skeleton screens
   - Progressive loading

---

## 🧪 Testing

### Tests Unitarios
```typescript
describe('Dashboard Queries', () => {
  it('debe filtrar ventas por rango de fechas', async () => {
    const filters = {
      fechaDesde: new Date('2025-01-01'),
      fechaHasta: new Date('2025-01-31')
    };
    const result = await getVentasPorDiaConCategorias(userId, filters);
    expect(result.every(v => v.fecha >= '2025-01-01' && v.fecha <= '2025-01-31')).toBe(true);
  });
});
```

### Tests de Integración
- Verificar que filtros actualicen gráficos
- Verificar toggle entre vistas
- Verificar tooltips muestran datos correctos

---

## 📊 Métricas de Éxito

- ✅ Filtros actualizan gráfico en < 1s
- ✅ Tooltips muestran categorías y totales correctamente
- ✅ Colores consistentes entre vistas
- ✅ Responsive en móvil y desktop
- ✅ Eje X se ajusta dinámicamente a filtros

---

## 🔄 Próximos Pasos

Después de implementar estas mejoras:

1. **Vistas por Mes y Año** (similar a MVP HTML)
2. **Exportar gráficos a PDF/imagen**
3. **Comparación multi-período**
4. **Filtros adicionales** (por cliente, producto)

---

**Documento creado:** 15/12/2025
**Basado en:** MVP HTML Dashboard + PRDs oficiales
**Tiempo estimado total:** 8-10 horas
