# PRD - Módulo DASHBOARD
**Product Requirements Document**

Versión 1.0 | 24/11/2025

---

## 1. Resumen del Módulo

### 1.1 Propósito
El módulo DASHBOARD proporciona una vista consolidada de métricas clave del negocio, alertas de cobranza y análisis visual del estado de ventas y pagos. Es la página principal del sistema y permite tomar decisiones informadas rápidamente.

### 1.2 Relaciones
- **Consume:** Datos de todos los módulos (CLIENTES, PRODUCTOS, VENTAS, PAGOS)
- **Propósito:** Visualización y análisis
- **No modifica:** Solo lectura de datos

---

## 2. Componentes del Dashboard

### 2.1 Tarjetas de Métricas Principales (KPIs)

**Ubicación:** Parte superior del dashboard

**Componentes:**

1. **Ventas Totales**
   - Número total de ventas en el período
   - **Color del valor: Negro (text-gray-900)** para máxima legibilidad
   - Comparación con período anterior
   - Indicador de tendencia (↑ o ↓)

2. **Monto Total Vendido**
   - Suma de todos los montos de ventas
   - Formato moneda: S/ XX,XXX.XX
   - **Color del valor: Negro (text-gray-900)** para máxima legibilidad de datos financieros
   - Comparación con período anterior

3. **Saldo Pendiente**
   - Suma de todos los saldos pendientes
   - **Color del valor: Amarillo (text-yellow-600)** para destacar pendientes
   - Link a "Ver Ventas Pendientes"

4. **Ventas Pagadas**
   - Número de ventas con estado PAGADO
   - Porcentaje del total
   - **Color del valor: Verde (text-green-600)** para indicar completado
   - Badge verde

5. **Pagos del Mes**
   - Número de pagos recibidos este mes
   - Monto total recibido
   - **Color del valor: Negro (text-gray-900)** para datos generales
   - Gráfico de línea pequeño (sparkline)

**Reglas de Color para KPIs (según feedback del MVP):**
- Valores numéricos generales (conteos, montos): **Negro** (text-gray-900)
- Montos pagados/completados: **Verde** (text-green-600)
- Saldos pendientes: **Amarillo** (text-yellow-600)
- Enlaces y botones: **Azul** (brand-500 / #0ea5e9)

### 2.2 Alertas y Notificaciones

**Ubicación:** Debajo de KPIs

**Componentes:**

1. **Ventas Pendientes con Alta Prioridad**
   - Lista de ventas con mayor saldo pendiente
   - Top 5 ordenadas por monto
   - Información: Cliente, Producto, Saldo, Días desde venta

2. **Próximos Pagos Esperados**
   - Ventas en cuotas con próximo pago pendiente
   - Basado en fecha_primer_pago y patrón de cuotas
   - Fase 2: Alertas por vencimiento

3. **Clientes con Múltiples Ventas Pendientes**
   - Clientes que tienen > 1 venta PENDIENTE
   - Total adeudado por cliente
   - Link a perfil de cliente

### 2.3 Gráficos y Visualizaciones

**1. Gráfico de Ventas por Período**
- Tipo: Gráfico de línea o barras
- Eje X: Últimos 30 días / 6 meses / 12 meses (seleccionable)
- Eje Y: Número de ventas o monto total
- Comparación: Ventas vs Pagos
- Colores: Ventas (azul), Pagos (verde)

**2. Distribución de Estado de Ventas**
- Tipo: Gráfico de dona (donut chart)
- Categorías: PAGADO (verde) vs PENDIENTE (amarillo)
- Muestra porcentajes y números absolutos

**3. Ventas por Producto**
- Tipo: Gráfico de barras horizontal
- Top 5 productos más vendidos
- Muestra cantidad y monto generado

**4. Métodos de Pago Más Usados**
- Tipo: Gráfico de barras o pie chart
- Distribución: Efectivo, Transferencia, Yape, Plin, Tarjeta
- Muestra número de transacciones y monto

**5. Clientes Top**
- Tipo: Tarjetas o lista
- Top 5 clientes por monto total comprado
- Información: Nombre, Total comprado, Número de ventas

### 2.4 Tablas de Datos Recientes

**1. Últimas Ventas**
- Tabla con últimas 10 ventas registradas
- Columnas: ID, Fecha, Cliente, Producto, Monto, Estado
- **Formato de Monto: Negro (text-gray-900) y font-bold** para máxima legibilidad
- Estados con badges de colores: Verde (PAGADO) / Amarillo (PENDIENTE)
- Acciones: Ver detalle
- Link: "Ver todas las ventas"

**Ejemplo de implementación:**
```tsx
<TableRow>
  <TableCell className="font-mono text-sm">{venta.venta_id}</TableCell>
  <TableCell>{formatDate(venta.fecha)}</TableCell>
  <TableCell>{venta.cliente.nombre}</TableCell>
  <TableCell>{venta.producto_nombre}</TableCell>
  <TableCell className="font-bold text-gray-900">S/ {formatNumber(venta.monto_total)}</TableCell>
  <TableCell>
    <Badge variant={venta.estado === 'PAGADO' ? 'success' : 'warning'}>
      {venta.estado}
    </Badge>
  </TableCell>
</TableRow>
```

**2. Últimos Pagos**
- Tabla con últimos 10 pagos recibidos
- Columnas: ID, Fecha, Cliente, Venta, Monto, Método
- **Formato de Monto: Verde (text-green-600) y font-semibold** para indicar dinero recibido
- Acciones: Ver detalle
- Link: "Ver todos los pagos"

**Reglas de Formato según Feedback del MVP:**
- Montos en Últimas Ventas: Negro (neutrales)
- Montos en Últimos Pagos: Verde (dinero recibido)
- IDs de transacción: Fuente monoespaciada
- Estados: Badges con colores semánticos

---

## 3. Modelo de Datos (Queries)

### 3.1 KPIs Principales

```typescript
interface DashboardKPIs {
  ventasTotales: {
    count: number;
    cambio: number; // Porcentaje vs período anterior
    tendencia: 'up' | 'down' | 'stable';
  };
  montoTotalVendido: {
    monto: number;
    cambio: number;
    tendencia: 'up' | 'down' | 'stable';
  };
  saldoPendiente: {
    monto: number;
    numVentas: number;
  };
  ventasPagadas: {
    count: number;
    porcentaje: number;
  };
  pagosMes: {
    count: number;
    monto: number;
    sparklineData: number[]; // Datos para gráfico pequeño
  };
}
```

**Query:**
```typescript
async function getDashboardKPIs(
  userId: string,
  fechaInicio: Date,
  fechaFin: Date
): Promise<DashboardKPIs> {
  // Ventas totales
  const ventasTotales = await db
    .select({ count: sql<number>`count(*)` })
    .from(ventas)
    .where(
      and(
        eq(ventas.user_id, userId),
        between(ventas.fecha, fechaInicio, fechaFin)
      )
    );

  // Monto total vendido
  const montoTotal = await db
    .select({ sum: sql<number>`COALESCE(SUM(monto_total), 0)` })
    .from(ventas)
    .where(/* ... */);

  // Saldo pendiente
  const saldoPendiente = await db
    .select({
      monto: sql<number>`COALESCE(SUM(saldo_pendiente), 0)`,
      count: sql<number>`COUNT(*)`
    })
    .from(ventas)
    .where(
      and(
        eq(ventas.user_id, userId),
        eq(ventas.estado, 'PENDIENTE')
      )
    );

  // ... resto de queries

  return { /* ... */ };
}
```

### 3.2 Ventas Pendientes Prioritarias

```typescript
interface VentaPendientePrioritaria {
  venta_id: string;
  cliente_nombre: string;
  producto_nombre: string;
  saldo_pendiente: number;
  fecha_venta: Date;
  dias_pendiente: number;
}

async function getVentasPendientesPrioritarias(
  userId: string,
  limit: number = 5
): Promise<VentaPendientePrioritaria[]> {
  return await db
    .select({
      venta_id: ventas.venta_id,
      cliente_nombre: clientes.nombre,
      producto_nombre: ventas.producto_nombre,
      saldo_pendiente: ventas.saldo_pendiente,
      fecha_venta: ventas.fecha,
      dias_pendiente: sql<number>`EXTRACT(DAY FROM AGE(NOW(), ${ventas.fecha}))`,
    })
    .from(ventas)
    .innerJoin(clientes, eq(ventas.cliente_id, clientes.id))
    .where(
      and(
        eq(ventas.user_id, userId),
        eq(ventas.estado, 'PENDIENTE')
      )
    )
    .orderBy(desc(ventas.saldo_pendiente))
    .limit(limit);
}
```

### 3.3 Datos para Gráficos

```typescript
interface VentasPorDia {
  fecha: string;
  num_ventas: number;
  monto_total: number;
}

async function getVentasPorPeriodo(
  userId: string,
  dias: number = 30
): Promise<VentasPorDia[]> {
  return await db
    .select({
      fecha: sql<string>`DATE(${ventas.fecha})`,
      num_ventas: sql<number>`COUNT(*)`,
      monto_total: sql<number>`SUM(${ventas.monto_total})`,
    })
    .from(ventas)
    .where(
      and(
        eq(ventas.user_id, userId),
        sql`${ventas.fecha} >= CURRENT_DATE - INTERVAL '${dias} days'`
      )
    )
    .groupBy(sql`DATE(${ventas.fecha})`)
    .orderBy(sql`DATE(${ventas.fecha})`);
}
```

---

## 4. Interfaz de Usuario

### 4.1 Layout del Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD                                    [Filtro: 30d ▼]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│
│  │Ventas  │  │Monto   │  │Saldo   │  │Pagadas │  │Pagos   ││
│  │Totales │  │Vendido │  │Pendien │  │        │  │del Mes ││
│  │   45   │  │S/12,500│  │S/3,200 │  │   35   │  │   28   ││
│  │  ↑12%  │  │  ↑8%   │  │        │  │  78%   │  │S/8,300 ││
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘│
│                                                               │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ ⚠️  ALERTAS Y VENTAS PENDIENTES                       │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │ • Juan Pérez - Parrilla Familiar - S/400 pendiente   │   │
│  │ • María López - Catering Premium - S/850 pendiente   │   │
│  │ • Carlos Ruiz - Parrilla Doble - S/300 pendiente     │   │
│  │   [Ver todas las ventas pendientes]                  │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌────────────────────────────┐  ┌─────────────────────────┐│
│  │ VENTAS POR PERÍODO         │  │ DISTRIBUCIÓN DE ESTADOS ││
│  │                            │  │                         ││
│  │ [Gráfico de línea/barras] │  │ [Gráfico de dona]       ││
│  │                            │  │  PAGADO: 78%            ││
│  │                            │  │  PENDIENTE: 22%         ││
│  └────────────────────────────┘  └─────────────────────────┘│
│                                                               │
│  ┌────────────────────────────┐  ┌─────────────────────────┐│
│  │ TOP 5 PRODUCTOS            │  │ MÉTODOS DE PAGO         ││
│  │                            │  │                         ││
│  │ [Barras horizontales]      │  │ [Gráfico de barras/pie] ││
│  │                            │  │                         ││
│  └────────────────────────────┘  └─────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ÚLTIMAS VENTAS                          [Ver todas]     ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ V-2024-045 │ 24/11 │ Juan P. │ Parrilla │ S/600 │ 🟡   ││
│  │ V-2024-044 │ 23/11 │ María L.│ Catering │ S/850 │ 🟢   ││
│  │ ...                                                      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ÚLTIMOS PAGOS                           [Ver todos]     ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ P-2024-028 │ 24/11 │ Juan P. │ V-2024-001 │ S/200 │ 💳 ││
│  │ P-2024-027 │ 23/11 │ Carlos R│ V-2024-003 │ S/150 │ 💵 ││
│  │ ...                                                      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Filtros de Período

**Selector en esquina superior derecha:**
- Últimos 7 días
- Últimos 30 días (default)
- Últimos 3 meses
- Últimos 6 meses
- Último año
- Personalizado (selector de rango)

**Comportamiento:**
- Al cambiar período, todos los KPIs y gráficos se actualizan
- Loading state mientras recarga datos
- Datos de comparación se ajustan (período anterior equivalente)

### 4.3 Responsive Design

**Desktop (>1024px):**
- Layout de 2-3 columnas
- Todos los componentes visibles
- Gráficos grandes

**Tablet (768px-1024px):**
- Layout de 2 columnas
- KPIs en 2 filas
- Gráficos medianos

**Mobile (<768px):**
- Layout de 1 columna (vertical stack)
- KPIs en scroll horizontal
- Gráficos pequeños/responsivos
- Tablas con scroll horizontal

---

## 5. API Endpoints

### 5.1 REST API

```typescript
// GET /api/dashboard/kpis
// Obtiene métricas principales
GET /api/dashboard/kpis?periodo=30d

// GET /api/dashboard/ventas-pendientes
// Obtiene ventas pendientes prioritarias
GET /api/dashboard/ventas-pendientes?limit=5

// GET /api/dashboard/charts/ventas-periodo
// Datos para gráfico de ventas
GET /api/dashboard/charts/ventas-periodo?dias=30

// GET /api/dashboard/charts/estado-ventas
// Distribución de estados
GET /api/dashboard/charts/estado-ventas?periodo=30d

// GET /api/dashboard/charts/productos-top
// Top productos
GET /api/dashboard/charts/productos-top?limit=5

// GET /api/dashboard/charts/metodos-pago
// Distribución métodos de pago
GET /api/dashboard/charts/metodos-pago?periodo=30d

// GET /api/dashboard/ultimas-ventas
// Últimas ventas registradas
GET /api/dashboard/ultimas-ventas?limit=10

// GET /api/dashboard/ultimos-pagos
// Últimos pagos recibidos
GET /api/dashboard/ultimos-pagos?limit=10
```

### 5.2 Server Actions

```typescript
// app/actions/dashboard.ts
export async function getDashboardKPIs(periodo: string)
export async function getVentasPendientesPrioritarias(limit?: number)
export async function getVentasPorPeriodo(dias: number)
export async function getEstadoVentas(periodo: string)
export async function getTopProductos(limit?: number)
export async function getMetodosPagoDistribution(periodo: string)
export async function getUltimasVentas(limit?: number)
export async function getUltimosPagos(limit?: number)
```

---

## 6. Librerías de Gráficos

### 6.1 Opciones Recomendadas

**Opción 1: Recharts** (Recomendado)
- Componentes React nativos
- API declarativa
- Responsive por defecto
- Documentación excelente
```bash
npm install recharts
```

**Opción 2: Chart.js con react-chartjs-2**
- Muy popular y estable
- Gran variedad de gráficos
- Buena performance
```bash
npm install chart.js react-chartjs-2
```

**Opción 3: Tremor** (Recomendado para MVP)
- Componentes de dashboard listos para usar
- Estilo moderno
- Compatible con Tailwind CSS
- Incluye KPIs, gráficos y tablas
```bash
npm install @tremor/react
```

### 6.2 Ejemplo con Tremor

```tsx
import { Card, Metric, Text, AreaChart } from '@tremor/react';

function DashboardKPI({ title, value, change, trend }) {
  return (
    <Card>
      <Text>{title}</Text>
      <Metric>{value}</Metric>
      <Text>
        {trend === 'up' ? '↑' : '↓'} {change}% vs período anterior
      </Text>
    </Card>
  );
}

function VentasChart({ data }) {
  return (
    <Card>
      <Text>Ventas por Período</Text>
      <AreaChart
        data={data}
        index="fecha"
        categories={["ventas", "pagos"]}
        colors={["blue", "green"]}
        valueFormatter={(value) => `S/ ${value.toLocaleString()}`}
      />
    </Card>
  );
}
```

---

## 7. Optimización de Performance

### 7.1 Estrategias de Caching

**1. Cache de KPIs**
- Cache Redis/Memory: 5 minutos
- Invalidar al registrar venta o pago

**2. Cache de Gráficos**
- Cache: 10 minutos
- Datos agregados no cambian frecuentemente

**3. Queries Optimizadas**
- Usar índices en fechas y user_id
- Agregaciones en base de datos (no en aplicación)
- LIMIT en queries de listas

### 7.2 Loading States

**Skeleton Screens:**
- Mostrar estructura del dashboard inmediatamente
- Cargar datos progresivamente
- Mejorar percepción de velocidad

**Progressive Loading:**
1. Cargar KPIs primero (más importantes)
2. Cargar alertas
3. Cargar gráficos
4. Cargar tablas

---

## 8. Features Futuras (Post-MVP)

### 8.1 Dashboard Personalizable
- Drag & drop de widgets
- Mostrar/ocultar componentes
- Guardar preferencias de usuario

### 8.2 Exportación de Reportes
- PDF con snapshot del dashboard
- Excel con datos detallados
- Envío automático por email (diario/semanal)

### 8.3 Alertas Configurables
- Notificaciones por email/SMS
- Umbrales personalizables
- Alertas de anomalías

### 8.4 Análisis Predictivo
- Proyección de ventas futuras
- Predicción de pagos
- Recomendaciones basadas en IA

### 8.5 Comparación Multi-Período
- Comparar semanas/meses/años
- Identificar estacionalidad
- Análisis de crecimiento

---

## 9. Testing

### 9.1 Tests Unitarios

```typescript
describe('Dashboard KPIs', () => {
  it('debería calcular ventas totales correctamente', async () => {
    const kpis = await getDashboardKPIs(userId, '30d');
    expect(kpis.ventasTotales.count).toBeGreaterThanOrEqual(0);
  });

  it('debería calcular saldo pendiente correctamente', async () => {
    await createVenta({ monto_total: 500, /* ... */ });
    const kpis = await getDashboardKPIs(userId, '30d');
    expect(kpis.saldoPendiente.monto).toBe(500);
  });
});

describe('Dashboard Charts', () => {
  it('debería retornar datos para gráfico de ventas', async () => {
    const data = await getVentasPorPeriodo(userId, 30);
    expect(data).toBeInstanceOf(Array);
    expect(data[0]).toHaveProperty('fecha');
    expect(data[0]).toHaveProperty('num_ventas');
  });
});
```

### 9.2 Tests de Integración

- Verificar actualización en tiempo real al crear venta
- Verificar actualización al registrar pago
- Validar cálculos de KPIs con datos reales
- Verificar filtros de período

### 9.3 Tests E2E

- Cargar dashboard y verificar todos los componentes
- Cambiar filtro de período y verificar actualización
- Click en "Ver todas" y navegar a módulos
- Responsive: verificar en móvil y desktop

---

## 10. Métricas de Éxito

### 10.1 Performance
- Tiempo de carga inicial: < 2s
- Tiempo de actualización de filtros: < 1s
- Lighthouse Performance Score: > 90

### 10.2 Usabilidad
- Usuario entiende el estado del negocio en < 30 segundos
- Tasa de uso del dashboard: > 80% de sesiones
- Tiempo promedio en dashboard: 2-5 minutos

---

**Documento preparado por:** SGV BRASA Team
**Última actualización:** 24/11/2025
