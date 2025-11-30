-- ====================================
-- FIX TEMPORAL PARA DESARROLLO SIN AUTH
-- ====================================
-- Este script desactiva temporalmente las políticas RLS restrictivas
-- y permite operaciones con user_id hardcodeado para desarrollo

-- OPCIÓN 1: Desactivar RLS completamente (MÁS SIMPLE PARA DEV)
-- ⚠️ ADVERTENCIA: Solo usar en desarrollo, NUNCA en producción

ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos DISABLE ROW LEVEL SECURITY;

-- ====================================
-- NOTA IMPORTANTE:
-- ====================================
-- Cuando implementes autenticación, deberás ejecutar:
--
-- ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
--
-- Y las políticas RLS del script original volverán a funcionar
-- automáticamente con auth.uid()
