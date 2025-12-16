# Instrucciones para Ejecutar Migración de Categorías

## Problema
El dashboard no muestra datos porque la tabla `productos` no tiene el campo `categoria` que se requiere para los gráficos por categoría.

## Solución
Ejecutar el script de migración `supabase-add-categoria.sql` en Supabase.

## Pasos para Ejecutar la Migración

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. **Ir a Supabase Dashboard**
   - Abrir: https://supabase.com/dashboard
   - Seleccionar tu proyecto

2. **Abrir SQL Editor**
   - En el menú lateral izquierdo, click en "SQL Editor"

3. **Ejecutar Script**
   - Click en "New Query"
   - Copiar y pegar el contenido de `supabase-add-categoria.sql`
   - Click en "Run" (o presionar Ctrl/Cmd + Enter)

4. **Verificar**
   - Deberías ver el mensaje: "Success. No rows returned"
   - Ir a "Table Editor" → "productos"
   - Verificar que existe la columna `categoria`

### Opción 2: Desde Supabase CLI

```bash
# Asegúrate de tener Supabase CLI instalado
supabase db push --db-url "postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres" < supabase-add-categoria.sql
```

## Verificación

Después de ejecutar la migración, puedes verificar con esta query:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'productos'
  AND column_name = 'categoria';
```

Deberías ver:
```
column_name | data_type         | is_nullable
------------|-------------------|------------
categoria   | character varying | YES
```

## Actualizar Productos Existentes (Opcional)

Si ya tienes productos en la base de datos y quieres asignarles categorías:

```sql
-- Ver productos sin categoría
SELECT producto_id, nombre, categoria FROM public.productos WHERE categoria IS NULL;

-- Actualizar productos específicos
UPDATE public.productos SET categoria = 'Parrillas' WHERE nombre LIKE '%Parrilla%';
UPDATE public.productos SET categoria = 'Bebidas' WHERE nombre LIKE '%Bebida%' OR nombre LIKE '%Refresco%';
UPDATE public.productos SET categoria = 'Postres' WHERE nombre LIKE '%Postre%' OR nombre LIKE '%Helado%';

-- O asignar categoría por defecto a todos los que no tienen
UPDATE public.productos SET categoria = 'General' WHERE categoria IS NULL;
```

## Después de la Migración

1. **Recargar la página del dashboard**
2. Los gráficos ahora deberían mostrar datos agrupados por categoría
3. Al crear nuevos productos, podrás seleccionar una categoría

## Categorías Sugeridas (basadas en el MVP)

- Parrillas
- Bebidas
- Postres
- Entradas
- Platos de Fondo
- Especiales
- General
- Otros

Estas categorías se pueden configurar en el frontend como un selector desplegable.
