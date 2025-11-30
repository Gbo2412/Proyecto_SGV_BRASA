-- ====================================
-- SGV BRASA - Sistema de Gestión de Ventas
-- Script de Configuración de Supabase
-- ====================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- TABLA: clientes
-- ====================================
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_cliente_id ON public.clientes(cliente_id);

-- Trigger para auto-generar cliente_id
CREATE OR REPLACE FUNCTION generate_cliente_id()
RETURNS TRIGGER AS $$
DECLARE
  year_suffix TEXT;
  next_num INTEGER;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(cliente_id FROM 'CLI-' || year_suffix || '-(.*)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.clientes
  WHERE cliente_id LIKE 'CLI-' || year_suffix || '%';

  NEW.cliente_id := 'CLI-' || year_suffix || '-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_cliente_id
BEFORE INSERT ON public.clientes
FOR EACH ROW
WHEN (NEW.cliente_id IS NULL OR NEW.cliente_id = '')
EXECUTE FUNCTION generate_cliente_id();

-- Trigger para updated_at en clientes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_clientes_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- TABLA: productos
-- ====================================
CREATE TABLE IF NOT EXISTS public.productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_productos_user_id ON public.productos(user_id);
CREATE INDEX IF NOT EXISTS idx_productos_producto_id ON public.productos(producto_id);

-- Trigger para auto-generar producto_id
CREATE OR REPLACE FUNCTION generate_producto_id()
RETURNS TRIGGER AS $$
DECLARE
  year_suffix TEXT;
  next_num INTEGER;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(producto_id FROM 'PROD-' || year_suffix || '-(.*)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.productos
  WHERE producto_id LIKE 'PROD-' || year_suffix || '%';

  NEW.producto_id := 'PROD-' || year_suffix || '-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_producto_id
BEFORE INSERT ON public.productos
FOR EACH ROW
WHEN (NEW.producto_id IS NULL OR NEW.producto_id = '')
EXECUTE FUNCTION generate_producto_id();

-- Trigger para updated_at en productos
CREATE TRIGGER trigger_productos_updated_at
BEFORE UPDATE ON public.productos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- TABLA: ventas
-- ====================================
CREATE TABLE IF NOT EXISTS public.ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venta_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
  cliente_nombre TEXT NOT NULL,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE RESTRICT,
  producto_nombre TEXT NOT NULL,
  fecha DATE NOT NULL,
  tipo_pago TEXT NOT NULL CHECK (tipo_pago IN ('contado', 'cuotas')),
  monto_total DECIMAL(10,2) NOT NULL CHECK (monto_total >= 0),
  num_cuotas INTEGER CHECK (num_cuotas IS NULL OR num_cuotas >= 2),
  monto_cuota DECIMAL(10,2) CHECK (monto_cuota IS NULL OR monto_cuota >= 0),
  monto_pagado DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (monto_pagado >= 0),
  saldo_pendiente DECIMAL(10,2) NOT NULL CHECK (saldo_pendiente >= 0),
  estado TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PAGADO', 'PENDIENTE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para ventas
CREATE INDEX IF NOT EXISTS idx_ventas_user_id ON public.ventas(user_id);
CREATE INDEX IF NOT EXISTS idx_ventas_venta_id ON public.ventas(venta_id);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente_id ON public.ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON public.ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON public.ventas(estado);

-- Trigger para auto-generar venta_id
CREATE OR REPLACE FUNCTION generate_venta_id()
RETURNS TRIGGER AS $$
DECLARE
  year_suffix TEXT;
  next_num INTEGER;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(venta_id FROM 'V-' || year_suffix || '-(.*)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.ventas
  WHERE venta_id LIKE 'V-' || year_suffix || '%';

  NEW.venta_id := 'V-' || year_suffix || '-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_venta_id
BEFORE INSERT ON public.ventas
FOR EACH ROW
WHEN (NEW.venta_id IS NULL OR NEW.venta_id = '')
EXECUTE FUNCTION generate_venta_id();

-- Trigger para calcular saldo_pendiente y estado al insertar/actualizar venta
CREATE OR REPLACE FUNCTION calculate_venta_saldo()
RETURNS TRIGGER AS $$
BEGIN
  NEW.saldo_pendiente := NEW.monto_total - NEW.monto_pagado;

  IF NEW.saldo_pendiente <= 0.01 THEN
    NEW.estado := 'PAGADO';
  ELSE
    NEW.estado := 'PENDIENTE';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_venta_saldo
BEFORE INSERT OR UPDATE ON public.ventas
FOR EACH ROW
EXECUTE FUNCTION calculate_venta_saldo();

-- Trigger para updated_at en ventas
CREATE TRIGGER trigger_ventas_updated_at
BEFORE UPDATE ON public.ventas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- TABLA: pagos
-- ====================================
CREATE TABLE IF NOT EXISTS public.pagos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pago_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venta_id UUID NOT NULL REFERENCES public.ventas(id) ON DELETE CASCADE,
  fecha_pago DATE NOT NULL,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  metodo_pago TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para pagos
CREATE INDEX IF NOT EXISTS idx_pagos_user_id ON public.pagos(user_id);
CREATE INDEX IF NOT EXISTS idx_pagos_venta_id ON public.pagos(venta_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha_pago ON public.pagos(fecha_pago);

-- Trigger para auto-generar pago_id
CREATE OR REPLACE FUNCTION generate_pago_id()
RETURNS TRIGGER AS $$
DECLARE
  year_suffix TEXT;
  next_num INTEGER;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(pago_id FROM 'PAG-' || year_suffix || '-(.*)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.pagos
  WHERE pago_id LIKE 'PAG-' || year_suffix || '%';

  NEW.pago_id := 'PAG-' || year_suffix || '-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_pago_id
BEFORE INSERT ON public.pagos
FOR EACH ROW
WHEN (NEW.pago_id IS NULL OR NEW.pago_id = '')
EXECUTE FUNCTION generate_pago_id();

-- Trigger para actualizar venta cuando se registra un pago
CREATE OR REPLACE FUNCTION update_venta_on_pago()
RETURNS TRIGGER AS $$
DECLARE
  total_pagado DECIMAL(10,2);
BEGIN
  -- Calcular total pagado para esta venta
  SELECT COALESCE(SUM(monto), 0) INTO total_pagado
  FROM public.pagos
  WHERE venta_id = NEW.venta_id;

  -- Actualizar la venta
  UPDATE public.ventas
  SET
    monto_pagado = total_pagado,
    saldo_pendiente = monto_total - total_pagado,
    estado = CASE
      WHEN (monto_total - total_pagado) <= 0.01 THEN 'PAGADO'
      ELSE 'PENDIENTE'
    END,
    updated_at = TIMEZONE('utc', NOW())
  WHERE id = NEW.venta_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_venta_on_pago
AFTER INSERT ON public.pagos
FOR EACH ROW
EXECUTE FUNCTION update_venta_on_pago();

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes
CREATE POLICY "Users can view their own clientes"
  ON public.clientes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clientes"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clientes"
  ON public.clientes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clientes"
  ON public.clientes FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para productos
CREATE POLICY "Users can view their own productos"
  ON public.productos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own productos"
  ON public.productos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own productos"
  ON public.productos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own productos"
  ON public.productos FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para ventas
CREATE POLICY "Users can view their own ventas"
  ON public.ventas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ventas"
  ON public.ventas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ventas"
  ON public.ventas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ventas"
  ON public.ventas FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para pagos
CREATE POLICY "Users can view their own pagos"
  ON public.pagos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pagos"
  ON public.pagos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pagos"
  ON public.pagos FOR DELETE
  USING (auth.uid() = user_id);

-- ====================================
-- FUNCIONES AUXILIARES
-- ====================================

-- Función para obtener KPIs del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_kpis(p_user_id UUID)
RETURNS TABLE (
  total_ventas BIGINT,
  monto_total DECIMAL,
  ventas_pagadas BIGINT,
  saldo_pendiente DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_ventas,
    COALESCE(SUM(v.monto_total), 0)::DECIMAL as monto_total,
    COUNT(*) FILTER (WHERE v.estado = 'PAGADO')::BIGINT as ventas_pagadas,
    COALESCE(SUM(v.saldo_pendiente), 0)::DECIMAL as saldo_pendiente
  FROM public.ventas v
  WHERE v.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- SCRIPT COMPLETADO
-- ====================================

-- Para ejecutar este script:
-- 1. Ve a tu proyecto en Supabase Dashboard
-- 2. Navega a SQL Editor
-- 3. Copia y pega este script completo
-- 4. Ejecuta el script

-- Verificar creación de tablas:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
