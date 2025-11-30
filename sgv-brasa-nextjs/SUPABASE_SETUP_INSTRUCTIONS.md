# Instrucciones de Configuración de Supabase

## Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Haz clic en "New project"
3. Completa los datos:
   - **Name**: `sgv-brasa` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (guárdala en un lugar seguro)
   - **Region**: Selecciona la más cercana (ej: `South America (São Paulo)`)
4. Haz clic en "Create new project"
5. Espera 2-3 minutos mientras se provisiona el proyecto

## Paso 2: Obtener Credenciales

1. En el dashboard de tu proyecto, ve a **Settings** (⚙️) en la barra lateral
2. Haz clic en **API**
3. Encontrarás:
   - **Project URL**: Algo como `https://xxxxxxxxxxxx.supabase.co`
   - **anon public**: Una clave que empieza con `eyJ...`

4. Copia estos valores

## Paso 3: Configurar Variables de Entorno

1. En la raíz del proyecto `sgv-brasa-nextjs/`, ya existe un archivo `.env.local`
2. Ábrelo y reemplaza los valores:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Guarda el archivo

## Paso 4: Ejecutar Script SQL en Supabase

### Opción A: Desde el Dashboard (Recomendado)

1. En tu proyecto de Supabase, ve a **SQL Editor** (icono de código `</>` en la barra lateral)
2. Haz clic en **New query**
3. Abre el archivo `supabase-setup.sql` desde este proyecto
4. Copia **todo** el contenido del archivo
5. Pégalo en el editor de Supabase
6. Haz clic en **Run** (botón verde en la esquina inferior derecha)
7. Deberías ver: "Success. No rows returned"

### Opción B: Desde la Terminal (Avanzado)

Si tienes el CLI de Supabase instalado:

```bash
npx supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres" < supabase-setup.sql
```

## Paso 5: Verificar la Creación de Tablas

1. En el dashboard de Supabase, ve a **Table Editor**
2. Deberías ver 4 tablas:
   - `clientes`
   - `productos`
   - `ventas`
   - `pagos`

3. Haz clic en cada tabla para ver su estructura

## Paso 6: Verificar Políticas RLS

1. Ve a **Authentication** > **Policies**
2. Verifica que cada tabla tenga 4 políticas:
   - SELECT (view own)
   - INSERT (insert own)
   - UPDATE (update own)
   - DELETE (delete own)

## Paso 7: Crear Usuario de Prueba

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add user** > **Create new user**
3. Completa:
   - **Email**: `test@sgvbrasa.com` (o cualquier email)
   - **Password**: Crea una contraseña (ej: `Test123456!`)
   - **Auto Confirm User**: ✅ Activa esto
4. Haz clic en **Create user**
5. Guarda estas credenciales para hacer login

## Paso 8: Probar la Configuración

En tu proyecto Next.js:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Verificación de Funciones

**IMPORTANTE**: Para estos tests, primero necesitas obtener el `user_id` del usuario que creaste en el Paso 7.

### Obtener tu User ID

```sql
-- Ejecuta esto en SQL Editor para obtener tu user_id
SELECT id, email FROM auth.users;
```

Copia el `id` del usuario (es un UUID como `123e4567-e89b-12d3-a456-426614174000`). Úsalo en los siguientes tests reemplazando `'TU-USER-ID-AQUI'`.

### Test 1: Verificar Triggers de Auto-generación de IDs

Ejecuta esto en SQL Editor de Supabase (reemplaza `'TU-USER-ID-AQUI'` con tu user_id real):

```sql
-- Test cliente_id - REEMPLAZA 'TU-USER-ID-AQUI' con el id de tu usuario
INSERT INTO public.clientes (user_id, nombre, email)
VALUES ('TU-USER-ID-AQUI', 'Test Cliente', 'test@example.com');

-- Ver el cliente_id generado automáticamente
SELECT cliente_id, nombre FROM public.clientes WHERE nombre = 'Test Cliente';
-- Debería retornar algo como: CLI-2025-001

-- Limpiar
DELETE FROM public.clientes WHERE nombre = 'Test Cliente';
```

### Test 2: Verificar Trigger de Actualización de Venta

Este test verifica que cuando se registra un pago, la venta se actualiza automáticamente.

```sql
-- IMPORTANTE: Reemplaza 'TU-USER-ID-AQUI' con tu user_id real en TODAS las líneas

-- Primero inserta un cliente y producto de prueba
INSERT INTO public.clientes (user_id, nombre)
VALUES ('TU-USER-ID-AQUI', 'Cliente Test');

INSERT INTO public.productos (user_id, nombre, precio)
VALUES ('TU-USER-ID-AQUI', 'Producto Test', 1000.00);

-- Crea una venta
INSERT INTO public.ventas (
  user_id, cliente_id, cliente_nombre, producto_id, producto_nombre,
  fecha, tipo_pago, monto_total, saldo_pendiente
)
SELECT
  'TU-USER-ID-AQUI',
  c.id, c.nombre, p.id, p.nombre,
  CURRENT_DATE, 'cuotas', 1000.00, 1000.00
FROM public.clientes c, public.productos p
WHERE c.nombre = 'Cliente Test' AND p.nombre = 'Producto Test';

-- Ver la venta creada
SELECT venta_id, cliente_nombre, monto_total, monto_pagado, saldo_pendiente, estado
FROM public.ventas
WHERE cliente_nombre = 'Cliente Test';
-- Debería mostrar: estado = PENDIENTE, monto_pagado = 0.00, saldo_pendiente = 1000.00

-- Registra un pago de 500
INSERT INTO public.pagos (user_id, venta_id, fecha_pago, monto)
SELECT
  'TU-USER-ID-AQUI',
  v.id, CURRENT_DATE, 500.00
FROM public.ventas v
WHERE v.cliente_nombre = 'Cliente Test';

-- Verifica que la venta se actualizó AUTOMÁTICAMENTE
SELECT venta_id, monto_total, monto_pagado, saldo_pendiente, estado
FROM public.ventas
WHERE cliente_nombre = 'Cliente Test';
-- Debería mostrar: monto_pagado = 500.00, saldo_pendiente = 500.00, estado = PENDIENTE

-- Registra otro pago para completar la venta
INSERT INTO public.pagos (user_id, venta_id, fecha_pago, monto)
SELECT
  'TU-USER-ID-AQUI',
  v.id, CURRENT_DATE, 500.00
FROM public.ventas v
WHERE v.cliente_nombre = 'Cliente Test';

-- Verifica que ahora está PAGADO
SELECT venta_id, monto_total, monto_pagado, saldo_pendiente, estado
FROM public.ventas
WHERE cliente_nombre = 'Cliente Test';
-- Debería mostrar: monto_pagado = 1000.00, saldo_pendiente = 0.00, estado = PAGADO

-- Limpiar (reemplaza con tu user_id)
DELETE FROM public.pagos WHERE user_id = 'TU-USER-ID-AQUI';
DELETE FROM public.ventas WHERE cliente_nombre = 'Cliente Test';
DELETE FROM public.productos WHERE nombre = 'Producto Test';
DELETE FROM public.clientes WHERE nombre = 'Cliente Test';
```

## Troubleshooting

### Error: "relation does not exist"

**Problema**: Las tablas no se crearon correctamente.

**Solución**:
1. Ve a SQL Editor
2. Ejecuta: `DROP TABLE IF EXISTS public.pagos, public.ventas, public.productos, public.clientes CASCADE;`
3. Vuelve a ejecutar el script completo `supabase-setup.sql`

### Error: "permission denied for table"

**Problema**: Las políticas RLS están bloqueando el acceso.

**Solución**:
1. Ve a Table Editor
2. Selecciona la tabla afectada
3. Ve a "RLS policies" en la parte superior
4. Verifica que las políticas estén activas
5. Si no existen, ejecuta nuevamente la sección de RLS del script

### Error: "JWT expired" o problemas de autenticación

**Problema**: El token de sesión expiró.

**Solución**:
1. Cierra sesión en tu app
2. Vuelve a iniciar sesión
3. O regenera el `NEXT_PUBLIC_SUPABASE_ANON_KEY` desde Settings > API

## Próximos Pasos

Una vez que Supabase esté configurado:

1. Implementar el sistema de autenticación en Next.js
2. Crear el layout con sidebar
3. Implementar los módulos (Clientes, Productos, Ventas, Pagos)
4. Implementar el Dashboard con KPIs

## Recursos Adicionales

- [Documentación de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Triggers en PostgreSQL](https://supabase.com/docs/guides/database/postgres/triggers)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo de BRASA.
