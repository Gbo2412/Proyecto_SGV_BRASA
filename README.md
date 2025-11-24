# SGV BRASA - MVP HTML

MVP rápido funcional para validar la idea del Sistema de Gestión de Ventas BRASA.

## 🚀 Características

✅ Dashboard con KPIs en tiempo real
✅ Crear ventas (contado y cuotas)
✅ Registrar pagos
✅ Actualización automática de estados
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

1. **Crear una venta:**
   - Ir a "Ventas"
   - Click "Nueva Venta"
   - Llenar formulario (prueba con 3 cuotas)
   - Guardar

2. **Registrar un pago:**
   - Ir a "Pagos"
   - Click "Registrar Pago"
   - Seleccionar la venta
   - Ingresar monto
   - Guardar

3. **Ver actualización automática:**
   - Volver a "Dashboard"
   - Ver KPIs actualizados
   - Ver estado de venta actualizado

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
