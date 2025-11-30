# SGV BRASA - Sistema de Gestión de Ventas

Sistema de gestión de ventas desarrollado con Next.js 15, Supabase y shadcn/ui.

## 🚀 Tecnologías

- **Next.js 15** - App Router, Server Components, Server Actions
- **TypeScript** - Tipado estático
- **Supabase** - Base de datos PostgreSQL con autenticación
- **Tailwind CSS** - Estilos utilitarios
- **shadcn/ui** - Componentes de UI
- **Zod** - Validación de esquemas
- **React Hook Form** - Gestión de formularios

## 📋 Requisitos Previos

- Node.js 18+
- npm o pnpm
- Cuenta en [Supabase](https://supabase.com)

## ⚙️ Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

#### a) Crear Proyecto en Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto
3. Anota tu **Project URL** y **anon key**

#### b) Ejecutar Script de Base de Datos

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase-setup.sql` de este repositorio
3. Copia y pega todo el contenido en el SQL Editor
4. Ejecuta el script (botón "Run")

Este script creará:
- Tablas: `clientes`, `productos`, `ventas`, `pagos`
- Triggers para auto-generación de IDs
- Políticas RLS (Row Level Security)
- Funciones auxiliares

#### c) Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

2. Reemplaza los valores con los de tu proyecto Supabase

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎨 Sistema de Colores

Basado en el feedback del MVP, se utiliza la siguiente paleta:

- **Brand (Azul)**: `#0ea5e9` - Botones primarios, links, navegación
- **Success (Verde)**: Para montos pagados y estados completados
- **Warning (Amarillo)**: Para saldos pendientes y alertas
- **Negro**: Para valores numéricos generales (máxima legibilidad)

## 📁 Estructura del Proyecto

```
sgv-brasa-nextjs/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx            # Dashboard principal
│   │   │   ├── clientes/           # Módulo de clientes
│   │   │   ├── productos/          # Módulo de productos
│   │   │   ├── ventas/             # Módulo de ventas
│   │   │   └── pagos/              # Módulo de pagos
│   │   ├── layout.tsx              # Layout principal
│   │   └── globals.css             # Estilos globales
│   ├── components/
│   │   └── ui/                     # Componentes shadcn/ui
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Cliente Supabase (browser)
│   │   │   └── server.ts           # Cliente Supabase (server)
│   │   └── utils.ts                # Utilidades
│   ├── types/
│   │   ├── database.types.ts       # Tipos de la BD
│   │   └── index.ts                # Tipos exportados
│   └── actions/                    # Server Actions
├── supabase-setup.sql              # Script de configuración de BD
└── README.md
```

## 🔐 Autenticación

El sistema utiliza Supabase Auth. Para probar en desarrollo:

1. En Supabase Dashboard, ve a **Authentication > Users**
2. Crea un usuario de prueba
3. Usa esas credenciales para iniciar sesión

## 📊 Funcionalidades

### Módulos Principales

1. **Dashboard**
   - KPIs de ventas
   - Últimas ventas
   - Últimos pagos

2. **Clientes**
   - CRUD completo
   - IDs auto-generados (CLI-2025-001)

3. **Productos**
   - CRUD completo
   - Control de stock
   - IDs auto-generados (PROD-2025-001)

4. **Ventas**
   - Registro de ventas al contado o en cuotas
   - Cálculo automático de montos
   - IDs auto-generados (V-2025-001)
   - Estados: PAGADO / PENDIENTE

5. **Pagos**
   - Registro de pagos vinculados a ventas
   - Actualización automática del saldo de la venta
   - IDs auto-generados (PAG-2025-001)

## 🚀 Deploy en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

## 📖 Documentación Adicional

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación shadcn/ui](https://ui.shadcn.com)

## 📝 Feedback del MVP

Este proyecto está basado en los aprendizajes del MVP en HTML. Ver `../MVP_FEEDBACK_Y_APRENDIZAJES.md` para detalles sobre:
- Decisiones de diseño
- Colores y tipografía
- Validaciones implementadas
- Mejoras UX aplicadas

## 🤝 Contribución

Este es un proyecto privado para BRASA. Para cambios, contactar al equipo de desarrollo.

## 📄 Licencia

Propietario: BRASA - Sistema de Gestión de Ventas
