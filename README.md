# ⚡ MAX LEVEL SUPLEMENTOS — Headless E-Commerce & Combos Express

Tienda online de suplementación deportiva de alto rendimiento desarrollada con **Next.js 14+ App Router** y conectada de forma **Headless a WooCommerce (WordPress)**.

Diseñada con foco exclusivo en **alta tasa de conversión móvil**, compras sin fricción (**Zero-Friction / Guest Checkout** sin contraseñas), enlaces directos a combos para campañas de Instagram y doble vía de pago: **Mercado Pago** y **WhatsApp Express**.

---

## 🚀 Características Principales

- **⚡ Velocidad Extrema (Next.js 14+):** Server Components con Incremental Static Regeneration (ISR) y carga casi instantánea.
- **🛒 Carrito Local Persistente (Zustand):** Carrito flotante en cliente (`localStorage`), barra interactiva de progreso para Envío Gratis y contador animado.
- **📱 Instagram Deep-Linking de Combos:** Campañas en Stories o Bio con `?combo=ID` o `/combos/[slug]` abren directamente el modal de configuración del combo con selector de sabores y botón de compra en 1 clic.
- **💳 Checkout Express en 1 Paso:** Formulario simple sin registro de contraseñas.
- **💵 Doble Canal de Pago:**
  1. **Mercado Pago:** Integración con Preferences API (Tarjetas de crédito/débito, dinero en cuenta, Rapipago).
  2. **WhatsApp Express:** Generación automática del pedido formateado y apertura del chat directo con el asesor comercial.
- **🔄 On-Demand Cache Revalidation:** Webhook listo (`/api/revalidate?secret=...`) para que cambios de stock o precio en WordPress se reflejen en la web al instante.
- **🎨 Athletic Dark Design System:** Interfaz deportiva de alto impacto visual (Tailwind CSS, acentos verde neón/volt `#CCFF00`, badges de descuento y microinteracciones táctiles).

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14+, React 18, TypeScript (Strict).
- **Estilos:** Tailwind CSS, Lucide React, Framer Motion.
- **Estado Global:** Zustand con middleware `persist`.
- **Backend / CMS:** WordPress + WooCommerce REST API (`/wp-json/wc/v3`).
- **Pagos:** Mercado Pago SDK (Node.js).
- **Alertas & Notificaciones:** Sonner.

---

## ⚙️ Configuración y Variables de Entorno

Creá un archivo `.env.local` en la raíz del proyecto (podés guiarte de `.env.example`):

```env
# Frontend URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend WooCommerce
WC_API_URL=https://tu-tienda-wordpress.com
WC_CONSUMER_KEY=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WC_CONSUMER_SECRET=cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WC_WEBHOOK_SECRET=tu_secreto_para_revalidar_cache

# Pasarela Mercado Pago
MP_ACCESS_TOKEN=APP_USR-XXXXXXXXXXXXXXXX-XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXX
MP_PUBLIC_KEY=APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

# Canales de Atención
NEXT_PUBLIC_WHATSAPP_PHONE=5491130009999
NEXT_PUBLIC_INSTAGRAM_HANDLE=max.level.suplementos
```

> **Nota:** La aplicación cuenta con un catálogo de demostración de alta pureza integrado como fallback. Si aún no conectaste las credenciales de WooCommerce, la web funcionará al 100% en modo demo con productos, combos y simulador de pagos.

---

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en `http://localhost:3000`.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta el linter de código.

---

## 📲 Estrategia de Links para Instagram

Para tus Stories, Reels o el enlace de la Bio:
- **Abrir combo específico al instante:** `https://tudominio.com/?combo=101`
- **Página de aterrizaje de campaña:** `https://tudominio.com/combos/combo-volumen-extremo`
- **Catálogo completo:** `https://tudominio.com/productos`
