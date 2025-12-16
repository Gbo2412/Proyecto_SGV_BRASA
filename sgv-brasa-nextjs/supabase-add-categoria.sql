-- ====================================
-- MIGRACIÓN: Agregar campo categoria a tabla productos
-- Fecha: 2025-12-15
-- Descripción: Agrega el campo categoria según PRD de productos
-- ====================================

-- Agregar campo categoria a la tabla productos
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);

-- Crear índice para mejorar performance de queries por categoría
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON public.productos(categoria);

-- Comentario en la columna
COMMENT ON COLUMN public.productos.categoria IS 'Categoría del producto para agrupación en reportes y dashboard';

-- Actualizar productos existentes con categoría por defecto (opcional)
-- UPDATE public.productos SET categoria = 'Sin categoría' WHERE categoria IS NULL;
