# PRD - Frontend & Design System
**Product Requirements Document**

Versión 1.0 | 24/11/2025

---

## 1. Resumen Ejecutivo

### 1.1 Visión del Diseño

Crear una experiencia de usuario moderna, accesible y eficiente inspirada en las mejores prácticas de productos SaaS de clase mundial como **Stripe**, **Linear** y **Vercel**, cumpliendo con estándares WCAG 2.1 Level AA y optimizada para productividad.

### 1.2 Principios de Diseño

**1. Claridad sobre Funcionalidad**
- La información más importante debe ser inmediatamente visible
- Jerarquía visual clara en cada vista
- Diseño orientado a tareas, no a características

**2. Velocidad y Eficiencia**
- Carga inicial < 2 segundos
- Interacciones instantáneas con optimistic updates
- Atajos de teclado para acciones comunes

**3. Accesibilidad por Defecto**
- WCAG 2.1 Level AA como mínimo
- Navegación completa por teclado
- Contraste de color AAA donde sea posible
- Screen reader friendly

**4. Consistencia y Familiaridad**
- Patrones de diseño establecidos
- Componentes reutilizables
- Comportamiento predecible

**5. Diseño Adaptativo**
- Mobile-first approach
- Responsive en todos los breakpoints
- Progressive enhancement

---

## 2. Inspiración y Referencias

### 2.1 Soluciones de Clase Mundial

**Stripe Dashboard** - Referencia para flujos de pago
- Dashboard limpio con métricas destacadas
- Tablas de datos claras y escaneables
- Estados de transacciones visuales
- [Stripe Dashboard](https://dashboard.stripe.com/)

**Linear** - Referencia para velocidad y UX
- Navegación ultra-rápida con Command Palette
- Atajos de teclado omnipresentes
- Diseño minimalista y enfocado
- Transiciones suaves y animaciones sutiles

**Vercel Dashboard** - Referencia para diseño moderno
- Design system Geist
- Tipografía clara y espaciado generoso
- Dark mode bien implementado
- [Vercel Dashboard](https://vercel.com/dashboard)

**Plecto & Geckoboard** - Referencia para dashboards de ventas
- Visualización de datos clara
- KPIs destacados y fáciles de escanear
- Uso efectivo de color para estados

### 2.2 Estudios de Referencia

- [Dashboard Design Inspirations 2024](https://muz.li/blog/dashboard-design-inspirations-in-2024/)
- [Modern Dashboard UI/UX Principles](https://medium.com/@allclonescript/20-best-dashboard-ui-ux-design-principles-you-need-in-2025-30b661f2f795)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)

---

## 3. Design System

### 3.1 Stack de Tecnologías UI

**Component Library: shadcn/ui + Radix UI**
```json
{
  "shadcn/ui": "latest",
  "@radix-ui/react-*": "^1.0.0",
  "tailwindcss": "^3.4.0",
  "tailwind-merge": "^2.0.0",
  "class-variance-authority": "^0.7.0"
}
```

**Ventajas:**
- ✅ Componentes accesibles por defecto (Radix)
- ✅ Customización total con Tailwind
- ✅ Copy-paste approach (control total del código)
- ✅ TypeScript nativo
- ✅ Dark mode integrado
- ✅ Producción probada (usado por Vercel, Supabase)

Referencias:
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Styling React Apps 2024](https://nishangiri.dev/blog/styling-react-apps)

**Iconografía: Lucide React**
```json
{
  "lucide-react": "^0.300.0"
}
```

**Charts: Recharts + Tremor**
```json
{
  "recharts": "^2.10.0",
  "@tremor/react": "^3.14.0"
}
```

### 3.2 Paleta de Colores

**Sistema de Color Semántico**

```typescript
// colors.ts
export const colors = {
  // Brand
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',  // Green
    600: '#16a34a',  // Green (darker)
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    500: '#eab308',  // Yellow
    600: '#ca8a04',  // Yellow (darker)
    700: '#a16207',
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',  // Red
    700: '#b91c1c',
  },

  // Neutral (Gray scale)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',  // Data display (black)
    950: '#0a0a0a',
  },
};
```

**Mapeo de Estados**

| Estado | Color | Uso |
|--------|-------|-----|
| PAGADO | `success-600` (verde) | Ventas completadas, montos pagados |
| PENDIENTE | `warning-600` (amarillo) | Ventas con saldo pendiente |
| ACTIVO | `success-500` (verde) | Clientes/productos activos |
| INACTIVO | `neutral-400` (gris) | Elementos desactivados |
| PRIMARY | `brand-500` (azul) | Acciones principales, links |
| DESTRUCTIVE | `error-500` (rojo) | Acciones de eliminación |
| DATA_VALUES | `neutral-900` (negro) | Valores numéricos, montos en KPIs |

**Contraste de Color (WCAG 2.1 AA)**

- Texto normal: mínimo 4.5:1
- Texto grande (18px+): mínimo 3:1
- Elementos UI: mínimo 3:1
- **Objetivo: AAA donde sea posible (7:1)**

```typescript
// Validación de contraste
const textOnPrimary = {
  foreground: colors.neutral[50],   // White text
  background: colors.brand[500],    // Primary blue
  contrast: 7.2,                     // AAA ✅
};

const textOnSuccess = {
  foreground: colors.neutral[900],  // Dark text
  background: colors.success[50],   // Light green bg
  contrast: 12.5,                    // AAA ✅
};
```

### 3.3 Tipografía

**Fuente Principal: Geist Sans (Vercel)**

```typescript
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

// O alternativa: Inter
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});
```

**Escala Tipográfica**

```css
/* Typography Scale */
.text-xs   { font-size: 0.75rem;  line-height: 1rem;    } /* 12px */
.text-sm   { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-base { font-size: 1rem;     line-height: 1.5rem;  } /* 16px */
.text-lg   { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
.text-xl   { font-size: 1.25rem;  line-height: 1.75rem; } /* 20px */
.text-2xl  { font-size: 1.5rem;   line-height: 2rem;    } /* 24px */
.text-3xl  { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl  { font-size: 2.25rem;  line-height: 2.5rem;  } /* 36px */
```

**Jerarquía de Texto**

| Elemento | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| H1 | `text-3xl` | `font-bold` (700) | Títulos de página |
| H2 | `text-2xl` | `font-semibold` (600) | Secciones principales |
| H3 | `text-xl` | `font-semibold` (600) | Subsecciones |
| H4 | `text-lg` | `font-medium` (500) | Títulos de tarjetas |
| Body | `text-base` | `font-normal` (400) | Texto principal |
| Small | `text-sm` | `font-normal` (400) | Texto secundario |
| Caption | `text-xs` | `font-normal` (400) | Metadatos, timestamps |

### 3.4 Espaciado y Layout

**Escala de Espaciado (8px base)**

```css
/* Spacing Scale */
.p-0  { padding: 0px;    }
.p-1  { padding: 4px;    }
.p-2  { padding: 8px;    }
.p-3  { padding: 12px;   }
.p-4  { padding: 16px;   }
.p-6  { padding: 24px;   }
.p-8  { padding: 32px;   }
.p-12 { padding: 48px;   }
.p-16 { padding: 64px;   }
```

**Grid y Breakpoints**

```typescript
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large Desktop
  '2xl': '1536px', // Extra Large
};

// Layout containers
const containerPadding = {
  mobile: '16px',   // p-4
  tablet: '24px',   // p-6
  desktop: '32px',  // p-8
};
```

**Espaciado de Componentes**

| Elemento | Espaciado |
|----------|-----------|
| Entre secciones principales | `space-y-12` (48px) |
| Entre tarjetas/cards | `space-y-6` (24px) |
| Entre elementos de formulario | `space-y-4` (16px) |
| Padding de tarjetas | `p-6` (24px) |
| Padding de botones | `px-4 py-2` (16px/8px) |

### 3.5 Componentes Base

**Botones**

```tsx
// Button Variants
import { Button } from '@/components/ui/button';

<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

**Especificaciones:**
- Altura mínima: 40px (target size WCAG)
- Padding horizontal: 16px mínimo
- Border radius: 6px
- Estados: default, hover, active, disabled, loading
- Focus visible con outline

**Inputs y Forms**

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="tu@email.com"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-red-500">
    {error}
  </p>
</div>
```

**Especificaciones:**
- Altura: 40px (WCAG compliant)
- Border: 1px solid neutral-300
- Focus: ring-2 ring-brand-500
- Error state: border-red-500
- Label siempre asociado con `htmlFor`

**Cards y Containers**

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Ventas del Mes</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Especificaciones:**
- Background: white (light) / neutral-900 (dark)
- Border: 1px solid neutral-200/800
- Border radius: 12px
- Shadow: subtle shadow-sm
- Padding: 24px (p-6)

**Badges y Estados**

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="success">PAGADO</Badge>
<Badge variant="warning">PENDIENTE</Badge>
<Badge variant="default">ACTIVO</Badge>
<Badge variant="destructive">INACTIVO</Badge>
```

**Tablas**

```tsx
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Venta ID</TableHead>
      <TableHead>Cliente</TableHead>
      <TableHead>Monto</TableHead>
      <TableHead>Estado</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {ventas.map(venta => (
      <TableRow key={venta.id}>
        <TableCell>{venta.venta_id}</TableCell>
        <TableCell>{venta.cliente.nombre}</TableCell>
        <TableCell className="font-bold text-gray-900">S/ {venta.monto_total}</TableCell>
        <TableCell>
          <Badge variant={venta.estado === 'PAGADO' ? 'success' : 'warning'}>
            {venta.estado}
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Nota: Los montos siempre deben mostrarse en negro (text-gray-900) para máxima legibilidad
// Solo los estados y badges usan colores semánticos (verde/amarillo)
```

---

## 4. Layouts y Vistas

### 4.1 Layout Principal

**Estructura: Sidebar + Main Content**

```
┌─────────────────────────────────────────────────┐
│ ┌─────┐ ┌─────────────────────────────────┐   │
│ │     │ │  Header / Breadcrumb            │   │
│ │     │ └─────────────────────────────────┘   │
│ │  S  │ ┌─────────────────────────────────┐   │
│ │  I  │ │                                 │   │
│ │  D  │ │                                 │   │
│ │  E  │ │     MAIN CONTENT AREA           │   │
│ │  B  │ │                                 │   │
│ │  A  │ │                                 │   │
│ │  R  │ │                                 │   │
│ │     │ │                                 │   │
│ │     │ └─────────────────────────────────┘   │
│ └─────┘                                         │
└─────────────────────────────────────────────────┘
```

**Sidebar (Navegación Principal)**

```tsx
// components/layout/sidebar.tsx
<aside className="w-64 border-r border-neutral-200 bg-white dark:bg-neutral-950">
  <div className="p-4">
    {/* Logo */}
    <div className="mb-8">
      <h1 className="text-xl font-bold">SGV BRASA</h1>
    </div>

    {/* Navigation */}
    <nav className="space-y-1">
      <NavLink href="/dashboard" icon={LayoutDashboard}>
        Dashboard
      </NavLink>
      <NavLink href="/ventas" icon={ShoppingCart}>
        Ventas
      </NavLink>
      <NavLink href="/pagos" icon={CreditCard}>
        Pagos
      </NavLink>
      <NavLink href="/clientes" icon={Users}>
        Clientes
      </NavLink>
      <NavLink href="/productos" icon={Package}>
        Productos
      </NavLink>
    </nav>

    {/* User section */}
    <div className="absolute bottom-4 left-4 right-4">
      <UserMenu />
    </div>
  </div>
</aside>
```

**Especificaciones Sidebar:**
- Ancho: 256px (w-64) en desktop
- Colapsable en tablet/mobile
- Items con hover state: bg-neutral-100
- Item activo: bg-brand-50 text-brand-600
- Iconos: 20x20px
- Espaciado entre items: 4px

**Header/Breadcrumb**

```tsx
<header className="border-b border-neutral-200 bg-white dark:bg-neutral-950">
  <div className="flex h-16 items-center justify-between px-6">
    <div className="flex items-center space-x-2">
      <Breadcrumb>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Ventas</BreadcrumbItem>
        <BreadcrumbItem current>Nueva Venta</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div className="flex items-center space-x-4">
      <CommandPalette />
      <ThemeToggle />
      <NotificationBell />
    </div>
  </div>
</header>
```

**Mobile Layout**

```
Mobile (<768px):
┌─────────────────────┐
│  Header + Menu      │
├─────────────────────┤
│                     │
│   Main Content      │
│   (Full Width)      │
│                     │
├─────────────────────┤
│  Bottom Nav Bar     │
└─────────────────────┘
```

### 4.2 Vista: Dashboard

**Layout del Dashboard**

```tsx
// app/(dashboard)/page.tsx
<div className="space-y-8 p-6">
  {/* KPIs Grid */}
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <KPICard
      title="Ventas Totales"
      value="45"
      change="+12%"
      trend="up"
      icon={ShoppingCart}
    />
    <KPICard
      title="Monto Vendido"
      value="S/ 12,500"
      change="+8%"
      trend="up"
      icon={DollarSign}
    />
    <KPICard
      title="Saldo Pendiente"
      value="S/ 3,200"
      change="-15%"
      trend="down"
      icon={AlertCircle}
    />
    <KPICard
      title="Ventas Pagadas"
      value="35 (78%)"
      change="+5%"
      trend="up"
      icon={CheckCircle}
    />
  </div>

  {/* Alertas */}
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-warning-500" />
        Ventas Pendientes de Cobro
      </CardTitle>
    </CardHeader>
    <CardContent>
      <VentasPendientesList />
    </CardContent>
  </Card>

  {/* Charts Grid */}
  <div className="grid gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Ventas por Período</CardTitle>
      </CardHeader>
      <CardContent>
        <VentasChart data={ventasData} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Estado de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <EstadoVentasChart data={estadoData} />
      </CardContent>
    </Card>
  </div>

  {/* Recent Activity */}
  <div className="grid gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Últimas Ventas</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/ventas">Ver todas</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UltimasVentasTable limit={5} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Últimos Pagos</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pagos">Ver todos</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UltimosPagosTable limit={5} />
      </CardContent>
    </Card>
  </div>
</div>
```

**KPI Card Component**

```tsx
interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  valueColor?: 'default' | 'success' | 'warning'; // Color del valor
}

function KPICard({ title, value, change, trend, icon: Icon, valueColor = 'default' }: KPICardProps) {
  const valueColorClass = {
    default: 'text-gray-900',      // Negro para datos generales (Ventas Totales, Monto Total)
    success: 'text-green-600',     // Verde para pagos/completados
    warning: 'text-yellow-600',    // Amarillo para pendientes
  }[valueColor];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className={cn("text-3xl font-bold", valueColorClass)}>{value}</p>
            {change && (
              <p className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend === 'up' ? 'text-success-500' : 'text-error-500'
              )}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {change} vs período anterior
              </p>
            )}
          </div>
          <div className="rounded-full bg-brand-100 p-3">
            <Icon className="h-6 w-6 text-brand-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Uso en Dashboard:
<KPICard
  title="Ventas Totales"
  value="45"
  valueColor="default"  // Negro
  change="+12%"
  trend="up"
  icon={ShoppingCart}
/>
<KPICard
  title="Monto Total"
  value="S/ 12,500"
  valueColor="default"  // Negro
  change="+8%"
  trend="up"
  icon={DollarSign}
/>
<KPICard
  title="Saldo Pendiente"
  value="S/ 3,200"
  valueColor="warning"  // Amarillo
  change="-15%"
  trend="down"
  icon={AlertCircle}
/>
<KPICard
  title="Ventas Pagadas"
  value="35 (78%)"
  valueColor="success"  // Verde
  change="+5%"
  trend="up"
  icon={CheckCircle}
/>
```

### 4.3 Vista: Lista de Ventas

```tsx
// app/(dashboard)/ventas/page.tsx
<div className="space-y-6 p-6">
  {/* Header con acciones */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold">Ventas</h1>
      <p className="text-neutral-500 mt-1">
        Gestiona todas tus ventas y su estado de pago
      </p>
    </div>
    <Button size="lg" asChild>
      <Link href="/ventas/nuevo">
        <Plus className="mr-2 h-4 w-4" />
        Nueva Venta
      </Link>
    </Button>
  </div>

  {/* Filtros y Búsqueda */}
  <Card>
    <CardContent className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Buscar por ID, cliente, producto..."
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PAGADO">Pagado</SelectItem>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tipoPagoFilter} onValueChange={setTipoPagoFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="contado">Contado</SelectItem>
              <SelectItem value="cuotas">Cuotas</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Stats Summary */}
  <div className="grid gap-4 md:grid-cols-3">
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-neutral-500">Total Ventas</div>
        <div className="text-2xl font-bold">45</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-neutral-500">Monto Total</div>
        <div className="text-2xl font-bold">S/ 12,500</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-neutral-500">Saldo Pendiente</div>
        <div className="text-2xl font-bold text-warning-500">S/ 3,200</div>
      </CardContent>
    </Card>
  </div>

  {/* Tabla de Ventas */}
  <Card>
    <CardContent className="p-0">
      <VentasTable data={ventas} />
    </CardContent>
  </Card>
</div>
```

**Tabla de Ventas (Diseño Optimizado)**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">ID</TableHead>
      <TableHead>Fecha</TableHead>
      <TableHead>Cliente</TableHead>
      <TableHead>Producto</TableHead>
      <TableHead className="text-right">Monto Total</TableHead>
      <TableHead className="text-right">Pagado</TableHead>
      <TableHead className="text-right">Saldo</TableHead>
      <TableHead>Tipo</TableHead>
      <TableHead>Estado</TableHead>
      <TableHead className="text-right">Acciones</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {ventas.map((venta) => (
      <TableRow
        key={venta.id}
        className="cursor-pointer hover:bg-neutral-50"
        onClick={() => router.push(`/ventas/${venta.id}`)}
      >
        <TableCell className="font-mono text-sm">
          {venta.venta_id}
        </TableCell>
        <TableCell>{formatDate(venta.fecha)}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {venta.cliente.nombre.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{venta.cliente.nombre}</span>
          </div>
        </TableCell>
        <TableCell>{venta.producto_nombre}</TableCell>
        <TableCell className="text-right font-medium">
          S/ {formatNumber(venta.monto_total)}
        </TableCell>
        <TableCell className="text-right text-success-600">
          S/ {formatNumber(venta.monto_pagado)}
        </TableCell>
        <TableCell className="text-right">
          <span className={cn(
            "font-medium",
            venta.saldo_pendiente > 0 ? "text-warning-600" : "text-neutral-400"
          )}>
            S/ {formatNumber(venta.saldo_pendiente)}
          </span>
        </TableCell>
        <TableCell>
          <Badge variant="outline">
            {venta.tipo_pago === 'cuotas' && `${venta.num_cuotas}x`}
            {venta.tipo_pago}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant={venta.estado === 'PAGADO' ? 'success' : 'warning'}>
            {venta.estado}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/ventas/${venta.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/pagos/nuevo?venta=${venta.id}`)}>
                <CreditCard className="mr-2 h-4 w-4" />
                Registrar pago
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error-600">
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
```

### 4.4 Vista: Formulario Nueva Venta

```tsx
// app/(dashboard)/ventas/nuevo/page.tsx
<div className="mx-auto max-w-3xl space-y-6 p-6">
  <div>
    <h1 className="text-3xl font-bold">Nueva Venta</h1>
    <p className="text-neutral-500 mt-1">
      Registra una nueva venta al contado o en cuotas
    </p>
  </div>

  <Card>
    <CardContent className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección: Información General */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información General</h3>

            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Venta *</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <FormControl>
                    <Combobox
                      {...field}
                      options={[
                        { id: 'nuevo', nombre: '+ Crear nuevo cliente' },
                        ...clientes
                      ]}
                      placeholder="Buscar cliente..."
                      emptyText="No se encontraron clientes"
                      renderOption={(cliente) => (
                        <div>
                          <div className="font-medium">{cliente.nombre}</div>
                          {cliente.email && (
                            <div className="text-sm text-neutral-500">{cliente.email}</div>
                          )}
                        </div>
                      )}
                      onChange={(value) => {
                        if (value === 'nuevo') {
                          setShowNuevoClienteForm(true);
                        } else {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecciona un cliente existente o crea uno nuevo desde el desplegable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Formulario Cliente Nuevo (aparece si selecciona "nuevo") */}
            {showNuevoClienteForm && (
              <Card className="border-brand-200 bg-brand-50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-brand-900">Nuevo Cliente</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNuevoClienteForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="cliente_nuevo.nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Cliente *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Juan Pérez García" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cliente_nuevo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="juan@ejemplo.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cliente_nuevo.telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" placeholder="987654321" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="producto_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producto/Servicio *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Auto-completar nombre y monto del producto
                        const productoSeleccionado = productos.find(p => p.id === value);
                        if (productoSeleccionado) {
                          form.setValue('producto_nombre', productoSeleccionado.nombre);
                          form.setValue('monto_total', productoSeleccionado.precio_base);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {productos.map((producto) => (
                          <SelectItem key={producto.id} value={producto.id}>
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="font-medium">{producto.nombre}</div>
                                <div className="text-sm text-neutral-500">{producto.categoria}</div>
                              </div>
                              <div className="text-sm font-medium ml-4">
                                S/ {formatNumber(producto.precio_base)}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    El monto se completará automáticamente pero puedes editarlo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servicio_adicional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicios Adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe servicios o productos adicionales..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Sección: Información de Pago */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Pago</h3>

            <FormField
              control={form.control}
              name="monto_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Total *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        S/
                      </span>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_pago"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pago *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contado" id="contado" />
                        <Label htmlFor="contado" className="cursor-pointer">
                          Contado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cuotas" id="cuotas" />
                        <Label htmlFor="cuotas" className="cursor-pointer">
                          Cuotas
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tipoPago === 'cuotas' && (
              <>
                <FormField
                  control={form.control}
                  name="num_cuotas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Cuotas *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="2"
                          placeholder="3"
                        />
                      </FormControl>
                      <FormDescription>
                        Monto por cuota: S/{' '}
                        {montoTotal && numCuotas
                          ? formatNumber(montoTotal / numCuotas)
                          : '0.00'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_primer_pago"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Primer Pago</FormLabel>
                      <FormControl>
                        <DatePicker {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notas adicionales sobre la venta..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Crear Venta
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  </Card>
</div>
```

---

## 5. Accesibilidad (WCAG 2.1 Level AA)

### 5.1 Principios Fundamentales

**1. Perceptible**
- Contraste mínimo 4.5:1 (texto normal)
- Contraste mínimo 3:1 (texto grande, iconos)
- Información no solo por color
- Texto redimensionable hasta 200%

**2. Operable**
- Navegación completa por teclado
- No trampas de teclado
- Tiempo suficiente para leer
- Sin contenido parpadeante

**3. Comprensible**
- Idioma de página definido
- Navegación consistente
- Identificación de errores clara
- Etiquetas e instrucciones

**4. Robusto**
- Compatible con tecnologías asistivas
- HTML semántico
- ARIA cuando es necesario

### 5.2 Implementación de Accesibilidad

**Navegación por Teclado**

```tsx
// Atajos de teclado globales
import { useHotkeys } from 'react-hotkeys-hook';

export function useGlobalHotkeys() {
  // Navegación
  useHotkeys('g d', () => router.push('/dashboard'));
  useHotkeys('g v', () => router.push('/ventas'));
  useHotkeys('g p', () => router.push('/pagos'));
  useHotkeys('g c', () => router.push('/clientes'));

  // Acciones
  useHotkeys('n', () => openNewModal());
  useHotkeys('/', () => focusSearch());
  useHotkeys('cmd+k', () => openCommandPalette());
}

// Focus visible
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      ringColor: {
        DEFAULT: 'hsl(var(--brand-500))',
      },
    },
  },
};

// Aplicar en todos los elementos interactivos
<Button className="focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
  Acción
</Button>
```

**Skip Links**

```tsx
// components/layout/skip-links.tsx
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 bg-brand-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
      >
        Saltar al contenido principal
      </a>
      <a
        href="#navigation"
        className="fixed left-4 top-16 z-50 bg-brand-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
      >
        Saltar a navegación
      </a>
    </div>
  );
}
```

**ARIA Labels y Semantic HTML**

```tsx
// Mal ❌
<div onClick={handleClick}>
  Ver más
</div>

// Bien ✅
<button
  onClick={handleClick}
  aria-label="Ver más detalles de la venta"
>
  Ver más
</button>

// Navegación semántica
<nav aria-label="Navegación principal">
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/ventas">Ventas</a></li>
  </ul>
</nav>

// Tablas accesibles
<table>
  <caption className="sr-only">Lista de ventas registradas</caption>
  <thead>
    <tr>
      <th scope="col">ID Venta</th>
      <th scope="col">Cliente</th>
      <th scope="col">Monto</th>
    </tr>
  </thead>
  <tbody>
    {/* ... */}
  </tbody>
</table>
```

**Formularios Accesibles**

```tsx
<form>
  {/* Label asociado correctamente */}
  <Label htmlFor="email">Email *</Label>
  <Input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby="email-error email-hint"
  />
  <p id="email-hint" className="text-sm text-neutral-500">
    Usaremos este email para enviarte notificaciones
  </p>
  {errors.email && (
    <p id="email-error" className="text-sm text-error-500" role="alert">
      {errors.email.message}
    </p>
  )}

  {/* Fieldset para grupos relacionados */}
  <fieldset>
    <legend className="text-lg font-semibold mb-4">Tipo de Pago</legend>
    <RadioGroup>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="contado" id="contado" />
        <Label htmlFor="contado">Contado</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="cuotas" id="cuotas" />
        <Label htmlFor="cuotas">Cuotas</Label>
      </div>
    </RadioGroup>
  </fieldset>
</form>
```

**Live Regions para Actualizaciones Dinámicas**

```tsx
// Notificaciones accesibles
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {notification && notification.message}
</div>

// Errores críticos
<div
  role="alert"
  aria-live="assertive"
  className="rounded-md bg-error-50 p-4"
>
  <p className="text-sm text-error-800">
    Error al guardar la venta. Por favor intenta nuevamente.
  </p>
</div>
```

### 5.3 Testing de Accesibilidad

**Herramientas**

```json
{
  "devDependencies": {
    "@axe-core/react": "^4.8.0",
    "jest-axe": "^8.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

**Test Example**

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Dashboard should not have accessibility violations', async () => {
  const { container } = render(<Dashboard />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 6. Interacciones y Micro-animaciones

### 6.1 Principios de Animación

- **Propósito**: Toda animación debe tener un propósito (feedback, orientación, deleite)
- **Duración**: 150-300ms para la mayoría de interacciones
- **Easing**: `ease-in-out` para transiciones naturales
- **Respeto a preferencias**: Respetar `prefers-reduced-motion`

### 6.2 Animaciones Comunes

**Loading States**

```tsx
// Skeleton Loading
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-neutral-200 rounded w-3/4" />
  <div className="h-4 bg-neutral-200 rounded w-1/2" />
</div>

// Spinner
<Loader2 className="h-4 w-4 animate-spin" />

// Progress Bar
<Progress value={progress} className="w-full" />
```

**Transitions**

```tsx
// Page transitions con Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  {children}
</motion.div>

// Hover effects
<Button className="transition-all hover:scale-105 active:scale-95">
  Acción
</Button>

// Card hover
<Card className="transition-shadow hover:shadow-lg">
  {content}
</Card>
```

**Toasts y Notifications**

```tsx
import { toast } from 'sonner';

// Success
toast.success('Venta creada exitosamente', {
  description: `Venta ${venta.venta_id} ha sido registrada`,
  action: {
    label: 'Ver',
    onClick: () => router.push(`/ventas/${venta.id}`),
  },
});

// Error
toast.error('Error al crear venta', {
  description: 'Por favor verifica los datos e intenta nuevamente',
});

// Loading
const toastId = toast.loading('Guardando venta...');
// ... after completion
toast.success('Venta guardada', { id: toastId });
```

**Modal/Dialog Animations**

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-[600px]">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <DialogHeader>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogDescription>
          Esta acción no se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      {/* content */}
    </motion.div>
  </DialogContent>
</Dialog>
```

### 6.3 Respeto a Preferencias de Usuario

```css
/* Reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// Hook para detectar prefers-reduced-motion
import { useReducedMotion } from 'framer-motion';

function Component() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ x: shouldReduceMotion ? 0 : 100 }}
    >
      {content}
    </motion.div>
  );
}
```

---

## 7. Dark Mode

### 7.1 Implementación

```tsx
// app/providers.tsx
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.Node }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

// components/theme-toggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

### 7.2 Colores para Dark Mode

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 10%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 10%;
    --border: 0 0% 90%;
    /* ... */
  }

  .dark {
    --background: 0 0% 5%;
    --foreground: 0 0% 95%;
    --card: 0 0% 7%;
    --card-foreground: 0 0% 95%;
    --border: 0 0% 15%;
    /* ... */
  }
}
```

**Contraste en Dark Mode**

```typescript
// Asegurar contraste AAA en dark mode
const darkModeColors = {
  background: 'hsl(0, 0%, 5%)',      // Casi negro
  foreground: 'hsl(0, 0%, 95%)',     // Casi blanco
  // Contrast ratio: 17:1 (AAA ✅)

  cardBackground: 'hsl(0, 0%, 7%)',
  cardForeground: 'hsl(0, 0%, 95%)',
  // Contrast ratio: 14:1 (AAA ✅)
};
```

---

## 8. Responsive Design

### 8.1 Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
};
```

### 8.2 Patrones Responsive

**Navigation**

```tsx
// Desktop: Sidebar
// Mobile: Bottom navigation + hamburger menu

{/* Desktop */}
<aside className="hidden lg:block w-64 border-r">
  <Sidebar />
</aside>

{/* Mobile */}
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <Sidebar />
  </SheetContent>
</Sheet>

{/* Mobile Bottom Nav */}
<nav className="fixed bottom-0 left-0 right-0 lg:hidden border-t bg-white">
  <div className="flex justify-around p-2">
    <NavItem href="/dashboard" icon={LayoutDashboard} />
    <NavItem href="/ventas" icon={ShoppingCart} />
    <NavItem href="/pagos" icon={CreditCard} />
    <NavItem href="/clientes" icon={Users} />
  </div>
</nav>
```

**Tables**

```tsx
// Desktop: Full table
// Mobile: Card list

{/* Desktop Table */}
<div className="hidden md:block">
  <Table>
    {/* Full table */}
  </Table>
</div>

{/* Mobile Cards */}
<div className="md:hidden space-y-4">
  {ventas.map(venta => (
    <Card key={venta.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-sm text-neutral-500">
              {venta.venta_id}
            </p>
            <p className="font-semibold">{venta.cliente.nombre}</p>
            <p className="text-sm text-neutral-500">
              {venta.producto_nombre}
            </p>
          </div>
          <Badge variant={venta.estado === 'PAGADO' ? 'success' : 'warning'}>
            {venta.estado}
          </Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Monto Total</p>
            <p className="text-lg font-bold">S/ {venta.monto_total}</p>
          </div>
          <Button variant="outline" size="sm">
            Ver detalle
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

**Forms**

```tsx
// Desktop: 2-column layout
// Mobile: Single column

<div className="grid gap-6 md:grid-cols-2">
  <FormField name="cliente_id" />
  <FormField name="producto_id" />
</div>

<div className="grid gap-6 md:grid-cols-3">
  <FormField name="monto_total" />
  <FormField name="tipo_pago" />
  <FormField name="num_cuotas" />
</div>
```

---

## 9. Performance y Optimización

### 9.1 Métricas Core Web Vitals

**Objetivos:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- INP (Interaction to Next Paint): < 200ms

### 9.2 Optimizaciones

**Images**

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="SGV BRASA Logo"
  width={200}
  height={50}
  priority // For above-the-fold images
/>
```

**Fonts**

```tsx
// app/layout.tsx
import { GeistSans } from 'geist/font/sans';

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**Code Splitting**

```tsx
// Dynamic imports para componentes pesados
const Chart = dynamic(() => import('@/components/charts/ventas-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const CommandPalette = dynamic(
  () => import('@/components/command-palette'),
  { ssr: false }
);
```

**Data Fetching**

```tsx
// Streaming con Suspense
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardContent />
</Suspense>

// Parallel data fetching
const [ventas, pagos, clientes] = await Promise.all([
  getVentas(),
  getPagos(),
  getClientes(),
]);
```

---

## 10. Guía de Estilo y Documentación

### 10.1 Storybook Setup

```bash
npx storybook@latest init
```

```tsx
// stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};
```

### 10.2 Figma Design File

**Estructura recomendada:**

```
SGV BRASA - Design System
├── 🎨 Foundation
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Icons
├── 🧩 Components
│   ├── Buttons
│   ├── Forms
│   ├── Cards
│   ├── Tables
│   └── Charts
├── 📱 Layouts
│   ├── Desktop
│   ├── Tablet
│   └── Mobile
└── 🖼️ Pages
    ├── Dashboard
    ├── Ventas
    ├── Pagos
    ├── Clientes
    └── Productos
```

---

## 11. Referencias y Recursos

### Soluciones de Clase Mundial
- [Stripe Dashboard Design](https://dashboard.stripe.com/)
- [Linear App](https://linear.app/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Geckoboard - Sales Dashboard](https://www.geckoboard.com/blog/7-best-sales-dashboard-tools-software-2024/)
- [Dashboard Design Inspirations 2024](https://muz.li/blog/dashboard-design-inspirations-in-2024/)

### Design Systems y Component Libraries
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tremor](https://www.tremor.so/)
- [Vercel Geist Design System](https://designsystems.surf/design-systems/vercel)
- [Styling React Apps 2024](https://nishangiri.dev/blog/styling-react-apps)

### Accesibilidad
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [WCAG 2.2 Updates](https://accessibe.com/blog/knowledgebase/wcag-two-point-two)
- [WCAG 2.1 Best Practices](https://edify.cr/insights/mastering-accessibility-best-practices-for-wcag-2-1-compliance-in-visual-design/)

### Design Inspiration
- [Dribbble - Sales Dashboard](https://dribbble.com/tags/sales-dashboard)
- [Dashboard UI Design Examples](https://colorwhistle.com/dashboard-ui-design-inspirations/)
- [Modern Dashboard Principles](https://medium.com/@allclonescript/20-best-dashboard-ui-ux-design-principles-you-need-in-2025-30b661f2f795)

---

**Documento preparado por:** SGV BRASA Team
**Última actualización:** 24/11/2025
**Versión:** 1.0
