# PRD - Módulo PRODUCTOS
**Product Requirements Document**

Versión 1.0 | 24/11/2025

---

## 1. Resumen del Módulo

### 1.1 Propósito
El módulo PRODUCTOS gestiona el catálogo maestro de productos y servicios ofrecidos por el negocio. Sirve como fuente de datos para el módulo VENTAS y permite mantener precios y descripciones actualizadas.

### 1.2 Relaciones
- **Origen para:** Módulo VENTAS (selección de producto)
- **Impacto:** Los cambios en precios se reflejan en nuevas ventas, no en ventas históricas

---

## 2. Modelo de Datos

### 2.1 Tabla: `productos`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, AUTO | Identificador único del producto |
| `producto_id` | VARCHAR(20) | UNIQUE, NOT NULL | ID legible (ej: PROD-2024-001) |
| `nombre` | VARCHAR(255) | NOT NULL | Nombre del producto/servicio |
| `descripcion` | TEXT | NULL | Descripción detallada |
| `categoria` | VARCHAR(100) | NULL | Categoría del producto |
| `precio_base` | DECIMAL(10,2) | NOT NULL | Precio base sugerido |
| `unidad` | VARCHAR(20) | DEFAULT 'unidad' | Unidad de medida |
| `sku` | VARCHAR(50) | UNIQUE, NULL | Código SKU interno |
| `estado` | ENUM | DEFAULT 'activo' | 'activo' o 'inactivo' |
| `notas` | TEXT | NULL | Observaciones internas |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |
| `user_id` | UUID | FOREIGN KEY | ID del usuario propietario |

### 2.2 Índices
```sql
CREATE INDEX idx_productos_producto_id ON productos(producto_id);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_user_id ON productos(user_id);
CREATE INDEX idx_productos_estado ON productos(estado);
CREATE INDEX idx_productos_sku ON productos(sku);
```

### 2.3 Ejemplo de Registro
```json
{
  "id": "234e5678-e89b-12d3-a456-426614174111",
  "producto_id": "PROD-2024-001",
  "nombre": "Parrilla Familiar",
  "descripcion": "Parrilla para 4-6 personas con carbón incluido",
  "categoria": "Parrillas",
  "precio_base": 150.00,
  "unidad": "servicio",
  "sku": "PAR-FAM-001",
  "estado": "activo",
  "notas": "Incluye ensaladas y bebidas",
  "created_at": "2024-11-24T10:00:00Z",
  "updated_at": "2024-11-24T10:00:00Z",
  "user_id": "user-uuid-here"
}
```

---

## 3. Funcionalidades

### 3.1 Crear Producto (CREATE)

**Entrada:**
```typescript
interface CreateProductoInput {
  nombre: string;                // Requerido
  descripcion?: string;          // Opcional
  categoria?: string;            // Opcional debe ser un un valor desplegable y configurable o por base de datos.
  precio_base: number;           // Requerido
  unidad?: string;               // Opcional, default: 'unidad'
  sku?: string;                  // Opcional
  notas?: string;                // Opcional
}
```

**Validaciones:**
- ✅ `nombre` es requerido y no puede estar vacío
- ✅ `precio_base` es requerido y debe ser > 0
- ✅ `producto_id` se genera automáticamente: `PROD-{año}-{número_secuencial}`
- ✅ `sku` debe ser único si se proporciona
- ✅ `precio_base` debe tener máximo 2 decimales

**Proceso:**
1. Validar datos de entrada
2. Generar `producto_id` único
3. Insertar en base de datos
4. Retornar producto creado

**Respuesta:**
```typescript
interface ProductoCreated {
  success: boolean;
  data: Producto;
  message: string;
}
```

### 3.2 Leer Productos (READ)

**3.2.1 Listar Todos los Productos**

**Entrada:**
```typescript
interface ListProductosInput {
  page?: number;                  // Default: 1
  limit?: number;                 // Default: 50
  search?: string;                // Búsqueda por nombre/descripción/sku
  categoria?: string;             // Filtro por categoría
  estado?: 'activo' | 'inactivo' | 'all'; // Default: 'activo'
  sortBy?: 'nombre' | 'precio_base' | 'created_at'; // Default: 'nombre'
  sortOrder?: 'asc' | 'desc';     // Default: 'asc'
}
```

**Respuesta:**
```typescript
interface ListProductosResponse {
  data: Producto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  categorias: string[]; // Lista de categorías únicas
}
```

**3.2.2 Obtener Producto por ID**

**Entrada:**
```typescript
interface GetProductoInput {
  id: string; // UUID
}
```

**Respuesta:**
```typescript
interface GetProductoResponse {
  data: Producto;
  stats?: {
    totalVentas: number;
    cantidadVendida: number;
    ingresoTotal: number;
    ultimaVenta: Date | null;
  };
}
```

### 3.3 Actualizar Producto (UPDATE)

**Entrada:**
```typescript
interface UpdateProductoInput {
  id: string;                    // Requerido (UUID)
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  precio_base?: number;
  unidad?: string;
  sku?: string;
  notas?: string;
  estado?: 'activo' | 'inactivo';
}
```

**Validaciones:**
- ✅ Producto debe existir
- ✅ Si se actualiza `sku`, no puede duplicar otro producto
- ✅ Si se actualiza `precio_base`, debe ser > 0
- ✅ Actualizar automáticamente `updated_at`

**Nota Importante:**
- Los cambios de precio NO afectan ventas existentes
- Solo afectan nuevas ventas creadas después del cambio

### 3.4 Eliminar Producto (DELETE)

**Entrada:**
```typescript
interface DeleteProductoInput {
  id: string; // UUID
}
```

**Validaciones:**
- ✅ Producto debe existir
- ❌ NO permitir eliminación si tiene ventas asociadas
- ✅ Opción alternativa: marcar como `inactivo` en lugar de eliminar

**Proceso Recomendado (Soft Delete):**
1. Verificar si tiene ventas asociadas
2. Si tiene ventas: cambiar `estado` a 'inactivo'
3. Si NO tiene ventas: permitir eliminación física
4. Retornar confirmación

---

## 4. Interfaz de Usuario

### 4.1 Vista Principal: Lista de Productos

**Componentes:**
- Tabla/Cards con: Producto ID, Nombre, Categoría, Precio, Estado
- Barra de búsqueda (nombre, descripción, SKU)
- Filtros: Categoría, Estado
- Ordenamiento por: Nombre, Precio, Fecha
- Botón "Nuevo Producto"
- Paginación

**Acciones por item:**
- Ver detalle (icono ojo)
- Editar (icono lápiz)
- Desactivar/Eliminar (icono trash)

### 4.2 Formulario: Nuevo/Editar Producto

**Layout:**
```
┌─────────────────────────────────────┐
│  [Crear/Editar Producto]            │
├─────────────────────────────────────┤
│  Nombre: [________________] *       │
│  Categoría: [____________]          │
│  SKU: [_________]                   │
│                                     │
│  Precio Base: S/ [_______] *        │
│  Unidad: [___________]              │
│                                     │
│  Descripción:                       │
│  [_________________________________]│
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  Notas Internas:                    │
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  Estado: (•) Activo  ( ) Inactivo   │
│                                     │
│  [Cancelar]  [Guardar Producto]    │
└─────────────────────────────────────┘
```

**Validación en Tiempo Real:**
- Nombre: obligatorio
- Precio base: obligatorio, numérico, > 0
- SKU: único
- Feedback visual: verde (válido), rojo (error)

### 4.3 Vista Detalle: Información del Producto

**Secciones:**

**Información Básica:**
- Producto ID
- Nombre
- Categoría
- Descripción
- Precio Base
- Unidad
- SKU
- Estado
- Notas
- Botón "Editar"

**Estadísticas:**
- Total de Ventas
- Cantidad Vendida
- Ingreso Total Generado
- Última Venta
- Precio Promedio de Venta

**Historial de Ventas:**
- Tabla con últimas 10 ventas
- Columnas: ID Venta, Fecha, Cliente, Precio Vendido, Estado
- Link "Ver todas las ventas"

---

## 5. API Endpoints

### 5.1 REST API (Next.js API Routes)

```typescript
// GET /api/productos
// Lista todos los productos con filtros y paginación
GET /api/productos?page=1&limit=50&search=parrilla&categoria=Parrillas&estado=activo

// GET /api/productos/[id]
// Obtiene un producto específico con stats
GET /api/productos/234e5678-e89b-12d3-a456-426614174111

// GET /api/productos/categorias
// Lista todas las categorías únicas
GET /api/productos/categorias

// POST /api/productos
// Crea un nuevo producto
POST /api/productos
Body: { nombre, precio_base, categoria, ... }

// PUT /api/productos/[id]
// Actualiza un producto existente
PUT /api/productos/234e5678-e89b-12d3-a456-426614174111
Body: { nombre, precio_base, ... }

// DELETE /api/productos/[id]
// Elimina o desactiva un producto
DELETE /api/productos/234e5678-e89b-12d3-a456-426614174111
```

### 5.2 Server Actions (Alternativa Moderna)

```typescript
// app/actions/productos.ts
export async function createProducto(data: CreateProductoInput)
export async function updateProducto(id: string, data: UpdateProductoInput)
export async function deleteProducto(id: string)
export async function getProductos(filters: ListProductosInput)
export async function getProductoById(id: string)
export async function getCategorias(): Promise<string[]>
```

---

## 6. Reglas de Negocio

### 6.1 Generación de Producto ID
- Formato: `PROD-{YYYY}-{NNN}`
- Ejemplo: `PROD-2024-001`, `PROD-2024-002`
- Se reinicia numeración cada año
- Se rellena con ceros a la izquierda (001, 002, ..., 100)

**Algoritmo:**
```typescript
async function generateProductoId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PROD-${year}-`;

  const lastProducto = await db
    .select()
    .from(productos)
    .where(like(producto_id, `${prefix}%`))
    .orderBy(desc(producto_id))
    .limit(1);

  const lastNumber = lastProducto?.[0]
    ? parseInt(lastProducto[0].producto_id.split('-')[2])
    : 0;

  const newNumber = (lastNumber + 1).toString().padStart(3, '0');
  return `${prefix}${newNumber}`;
}
```

### 6.2 Gestión de Precios
- El `precio_base` es un precio sugerido
- En el módulo VENTAS se puede modificar el precio final
- Los cambios de precio NO afectan ventas históricas
- Se recomienda mantener historial de cambios de precio (Fase 2)

### 6.3 Categorías
- Las categorías se crean dinámicamente al agregar productos
- No hay catálogo fijo de categorías (MVP)
- Autocomplete sugiere categorías existentes
- Fase 2: Gestión formal de categorías

### 6.4 Productos Inactivos
- Productos inactivos NO aparecen en listas desplegables de VENTAS
- Productos inactivos mantienen su historial de ventas
- Se pueden reactivar en cualquier momento

---

## 7. Casos de Uso

### 7.1 UC-PROD-01: Registrar Nuevo Producto

**Actor:** Usuario

**Precondiciones:**
- Usuario autenticado

**Flujo Principal:**
1. Usuario navega a módulo PRODUCTOS
2. Click en botón "Nuevo Producto"
3. Sistema muestra formulario vacío
4. Usuario ingresa nombre (obligatorio)
5. Usuario ingresa precio base (obligatorio)
6. Usuario selecciona/escribe categoría (opcional)
7. Usuario ingresa descripción y SKU (opcional)
8. Usuario ingresa unidad y notas (opcional)
9. Click en "Guardar Producto"
10. Sistema valida datos
11. Sistema genera `producto_id` automáticamente
12. Sistema guarda en base de datos
13. Sistema muestra mensaje de éxito
14. Sistema redirige a lista de productos

**Flujo Alternativo 10a: Datos inválidos**
- Sistema muestra errores en campos correspondientes
- Usuario corrige errores
- Continúa en paso 9

**Flujo Alternativo 10b: SKU duplicado**
- Sistema muestra error "SKU ya existe"
- Usuario corrige SKU
- Continúa en paso 9

### 7.2 UC-PROD-02: Buscar Producto para Venta

**Actor:** Usuario (desde módulo VENTAS)

**Flujo Principal:**
1. Usuario está creando una venta
2. Usuario hace click en campo "Producto"
3. Sistema muestra autocomplete con productos activos
4. Usuario escribe nombre o categoría
5. Sistema filtra resultados en tiempo real
6. Sistema muestra: nombre, categoría, precio base
7. Usuario selecciona producto de la lista
8. Sistema completa campo con producto seleccionado
9. Sistema carga precio base en campo precio (editable)

### 7.3 UC-PROD-03: Actualizar Precio de Producto

**Actor:** Usuario

**Flujo Principal:**
1. Usuario navega a lista de productos
2. Usuario hace click en producto específico
3. Sistema muestra vista detalle
4. Usuario hace click en "Editar"
5. Sistema muestra formulario con datos actuales
6. Usuario modifica precio base
7. Click en "Guardar Producto"
8. Sistema valida nuevo precio
9. Sistema actualiza producto
10. Sistema muestra mensaje: "Precio actualizado. Solo afectará nuevas ventas"
11. Sistema redirige a vista detalle

**Postcondición:**
- Nuevas ventas usarán el nuevo precio
- Ventas existentes mantienen su precio original

---

## 8. Validaciones y Errores

### 8.1 Validaciones Frontend (Zod Schema)

```typescript
import { z } from 'zod';

export const ProductoSchema = z.object({
  nombre: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(255, 'Nombre demasiado largo'),

  descripcion: z.string()
    .max(1000, 'Descripción demasiado larga')
    .optional(),

  categoria: z.string()
    .max(100, 'Categoría demasiado larga')
    .optional(),

  precio_base: z.number()
    .positive('Precio debe ser mayor a 0')
    .multipleOf(0.01, 'Precio debe tener máximo 2 decimales'),

  unidad: z.string()
    .max(20, 'Unidad demasiado larga')
    .default('unidad'),

  sku: z.string()
    .max(50, 'SKU demasiado largo')
    .optional()
    .or(z.literal('')),

  notas: z.string()
    .max(1000, 'Notas demasiado largas')
    .optional(),

  estado: z.enum(['activo', 'inactivo']).default('activo'),
});
```

### 8.2 Mensajes de Error

| Código | Mensaje | Acción |
|--------|---------|--------|
| `PROD_001` | Nombre es obligatorio | Solicitar nombre |
| `PROD_002` | Precio base es obligatorio | Solicitar precio |
| `PROD_003` | Precio debe ser mayor a 0 | Corregir precio |
| `PROD_004` | SKU ya existe | Usar otro SKU |
| `PROD_005` | Producto no encontrado | Verificar ID |
| `PROD_006` | No se puede eliminar: tiene ventas | Desactivar en su lugar |
| `PROD_007` | Precio tiene más de 2 decimales | Corregir decimales |

---

## 9. Testing

### 9.1 Tests Unitarios

```typescript
describe('Módulo Productos', () => {
  describe('createProducto', () => {
    it('debería crear producto con datos válidos', async () => {
      const input = {
        nombre: 'Parrilla Familiar',
        precio_base: 150.00,
        categoria: 'Parrillas',
      };
      const result = await createProducto(input);
      expect(result.success).toBe(true);
      expect(result.data.producto_id).toMatch(/PROD-\d{4}-\d{3}/);
    });

    it('debería rechazar producto sin nombre', async () => {
      const input = { precio_base: 100 };
      await expect(createProducto(input)).rejects.toThrow();
    });

    it('debería rechazar precio negativo', async () => {
      const input = { nombre: 'Test', precio_base: -10 };
      await expect(createProducto(input)).rejects.toThrow();
    });

    it('debería rechazar SKU duplicado', async () => {
      await createProducto({ nombre: 'Prod 1', precio_base: 50, sku: 'SKU-001' });
      await expect(
        createProducto({ nombre: 'Prod 2', precio_base: 60, sku: 'SKU-001' })
      ).rejects.toThrow();
    });
  });

  describe('updateProducto', () => {
    it('debería actualizar precio sin afectar ventas existentes', async () => {
      const producto = await createProducto({ nombre: 'Test', precio_base: 100 });
      const venta = await createVenta({ producto_id: producto.id, precio: 100 });

      await updateProducto(producto.id, { precio_base: 150 });

      const ventaActualizada = await getVenta(venta.id);
      expect(ventaActualizada.precio).toBe(100); // Precio original
    });
  });
});
```

### 9.2 Tests de Integración

- CRUD completo en base de datos
- Relaciones con módulo VENTAS
- Búsqueda y filtros
- Gestión de categorías

### 9.3 Tests E2E (Playwright)

- Flujo completo de creación de producto
- Búsqueda y selección desde módulo VENTAS
- Actualización de precio
- Desactivación de producto con ventas

---

## 10. Performance

### 10.1 Optimizaciones
- Índices en columnas de búsqueda frecuente
- Paginación en lista de productos (50 por página)
- Debounce en búsqueda autocomplete (300ms)
- Cache de productos activos (5 minutos)
- Cache de lista de categorías (10 minutos)

### 10.2 Métricas
- Tiempo de carga lista: < 500ms
- Tiempo de búsqueda: < 200ms
- Tiempo de creación: < 1s

---

## 11. Seguridad

### 11.1 Row Level Security (RLS)

```sql
-- Política: Los usuarios solo ven sus propios productos
CREATE POLICY "Users can view own productos"
  ON productos FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden crear sus propios productos
CREATE POLICY "Users can insert own productos"
  ON productos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propios productos
CREATE POLICY "Users can update own productos"
  ON productos FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propios productos
CREATE POLICY "Users can delete own productos"
  ON productos FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 12. Migraciones

### 12.1 Script de Importación desde Excel

```typescript
// scripts/import-productos-from-excel.ts
import * as XLSX from 'xlsx';

interface ExcelProducto {
  'Producto ID': string;
  'Nombre': string;
  'Descripción': string;
  'Precio': number;
}

async function importProductosFromExcel(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['PRODUCTOS'];
  const data: ExcelProducto[] = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    await createProducto({
      nombre: row.Nombre,
      descripcion: row.Descripción || undefined,
      precio_base: row.Precio,
    });
  }

  console.log(`Imported ${data.length} productos`);
}
```

---

## 13. Features Futuras (Post-MVP)

### 13.1 Gestión de Inventario
- Control de stock
- Alertas de stock bajo
- Historial de movimientos

### 13.2 Precios Dinámicos
- Precios por cliente
- Precios por volumen
- Descuentos y promociones

### 13.3 Catálogo Público
- Vista de catálogo para clientes
- Carrito de compras
- Cotizaciones online

### 13.4 Análisis Avanzado
- Productos más vendidos
- Márgenes de ganancia
- Tendencias de venta
- Predicción de demanda

---

**Documento preparado por:** SGV BRASA Team
**Última actualización:** 24/11/2025
