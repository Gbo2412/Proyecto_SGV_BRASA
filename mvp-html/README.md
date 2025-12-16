# SGV BRASA - MVP HTML

MVP rápido funcional para validar la idea del Sistema de Gestión de Ventas BRASA.

## 🚀 Características

✅ Dashboard con KPIs en tiempo real
✅ **Filtros por fecha:** Filtra ventas por rango de fechas (desde/hasta) - el eje X se ajusta dinámicamente
✅ **Gráficos interactivos avanzados:**
   - Vista temporal: Por día/mes/año con **barras apiladas por categoría** (cada color representa una categoría)
   - Vista por categoría: Ventas agrupadas por categoría de producto
   - Tooltip muestra detalle por categoría y total
   - Leyenda interactiva en la parte inferior
✅ Crear ventas (contado y cuotas) con fecha editable
✅ **Cliente existente o nuevo:** Selector desplegable con opción de crear cliente al momento de la venta
✅ **Producto existente o nuevo:** Selector desplegable con opción de crear producto al momento de la venta
✅ **Productos con auto-completado:** Al seleccionar un producto, el monto se completa automáticamente (editable)
✅ **Editar registros:** Editar ventas, clientes y productos después de crearlos
✅ **IDs dinámicos por año:** Formato V-2025-001, CLI-2025-001, etc.
✅ **Fecha de creación:** Se guarda automáticamente para clientes
✅ Registrar pagos con validación
✅ Actualización automática de estados (PAGADO/PENDIENTE)
✅ Cálculo automático de saldo pendiente
✅ Validación (no exceder saldo)
✅ Responsive design
✅ LocalStorage (persiste datos en el navegador)

## 📦 Archivos

```
mvp-html/
├── index.html       - Dashboard
├── ventas.html      - Gestión de ventas
├── pagos.html       - Registro de pagos
├── clientes.html    - Lista de clientes
├── productos.html   - Lista de productos
└── vercel.json      - Configuración Vercel
```

## 🏃 Testing Local

### Opción 1: Abrir directamente
```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### Opción 2: Con servidor local
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve

# Luego abrir: http://localhost:8000
```

## 🌐 Deploy a Vercel

### Opción 1: CLI (MÁS RÁPIDO - 2 minutos)
```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Desde la carpeta mvp-html
cd mvp-html
vercel --prod
```

### Opción 2: GitHub + Vercel (5 minutos)
```bash
# Inicializar git
git init
git add .
git commit -m "MVP HTML"

# Subir a GitHub
git remote add origin [URL_TU_REPO]
git push -u origin main

# Luego en vercel.com:
# 1. New Project
# 2. Import from GitHub
# 3. Select repo
# 4. Deploy
```

### Opción 3: Drag & Drop (1 minuto)
1. Ir a https://vercel.com/new
2. Arrastrar la carpeta `mvp-html`
3. Click "Deploy"
4. ¡Listo!

## 📝 Cómo Probar

1. **Crear productos primero:**
   - Ir a "Productos"
   - Click "Nuevo Producto"
   - Ejemplo: Nombre="Parrilla Familiar", Precio=600
   - Guardar

2. **Crear una venta con cliente nuevo y producto nuevo:**
   - Ir a "Ventas"
   - Click "Nueva Venta"
   - La fecha de hoy aparece por defecto (puedes cambiarla)
   - En Cliente, seleccionar "+ Crear nuevo cliente"
   - Llenar datos del cliente
   - En Producto, seleccionar "+ Crear nuevo producto"
   - Llenar nombre y precio del producto
   - El monto se completa automáticamente (puedes editarlo)
   - Seleccionar tipo de pago (prueba con 3 cuotas)
   - Guardar
   - ✨ El cliente y producto se crean automáticamente
   - Nota: El ID será V-2025-001 (año actual)

3. **Crear venta con cliente y producto existente:**
   - Click "Nueva Venta"
   - Seleccionar cliente del desplegable
   - Seleccionar producto del desplegable
   - El monto se auto-completa
   - Guardar

3.5. **Editar una venta:**
   - En la lista de ventas, click "Editar"
   - Modificar los campos necesarios
   - Click "Actualizar Venta"

4. **Registrar un pago:**
   - Ir a "Pagos"
   - Click "Registrar Pago"
   - Seleccionar la venta
   - Ingresar monto
   - Guardar

5. **Ver actualización automática:**
   - Volver a "Dashboard"
   - Ver KPIs actualizados
   - Ver estado de venta actualizado
   - Usar el gráfico para ver ventas por día, mes o año

6. **Usar filtros y gráficos avanzados:**
   - En Dashboard, selecciona un rango de fechas (desde/hasta)
   - Click en "Aplicar Filtros" para ver solo ventas en ese rango
   - Los KPIs y gráficos se actualizarán automáticamente
   - **El eje X del gráfico se ajusta automáticamente al rango de fechas seleccionado**
   - Cambia entre "Por Período" y "Por Categoría" para diferentes vistas
   - En "Por Período", verás **barras apiladas con colores por categoría** - cada color representa una categoría de producto
   - Pasa el mouse sobre las barras para ver el detalle de cada categoría y el total
   - En "Por Categoría", verás las ventas totales agrupadas por categoría
   - Click en la leyenda para ocultar/mostrar categorías específicas
   - Click en "Limpiar" para volver a ver todas las ventas

7. **Editar clientes y productos:**
   - Ir a "Clientes" o "Productos"
   - Click "Editar" en cualquier registro
   - Modificar los datos
   - Guardar cambios

## ⚠️ Limitaciones del MVP

- ⚠️ Datos solo en browser (LocalStorage)
- ⚠️ No compartido entre dispositivos
- ⚠️ Sin autenticación
- ⚠️ Si limpias cache, pierdes datos

## 💾 Backup de Datos

Para hacer backup de tus datos de prueba:

**Exportar:**
```javascript
// Abrir consola del navegador (F12) y ejecutar:
const data = {
  ventas: localStorage.getItem('ventas'),
  pagos: localStorage.getItem('pagos'),
  clientes: localStorage.getItem('clientes'),
  productos: localStorage.getItem('productos')
};
console.log(JSON.stringify(data));
// Copiar el resultado y guardarlo en un archivo
```

**Importar:**
```javascript
// Pegar tus datos en la variable data y ejecutar:
const data = { /* pegar datos aquí */ };
localStorage.setItem('ventas', data.ventas);
localStorage.setItem('pagos', data.pagos);
localStorage.setItem('clientes', data.clientes);
localStorage.setItem('productos', data.productos);
location.reload();
```

## 📊 Próximos Pasos

Si el MVP valida bien:
- Seguir con el plan completo: `../PLAN_IMPLEMENTACION.md`
- Implementar versión con backend (Next.js + Supabase)
- Timeline: 6-8 semanas para versión completa

## 📞 Soporte

Ver documentación completa en `../INDICE_GENERAL.md`
