# 🚀 CONTEXT.MD — MAX LEVEL SUPLEMENTOS (Headless E-Commerce & Combos Express)

---

## 📌 1. RESUMEN DEL PROYECTO & VISIÓN

**MAX LEVEL Suplementos** (`@max.level.suplementos`) es una marca y tienda especializada en la venta de suplementación deportiva de alto rendimiento (proteínas, creatinas, pre-entrenos, aminoácidos, quemadores, multivitamínicos y combos promocionales).

### Objetivo Principal
Desarrollar una Web Catálogo / E-Commerce de **alta conversión móvil** conectada de forma **Headless a WooCommerce**, sin registro obligatorio de usuarios ni contraseñas, ultra optimizada para tráfico masivo proveniente de redes sociales (Instagram Reels, Stories, Bio y WhatsApp).

### Pilares de Negocio y UX
1. **Headless Backend (WooCommerce):** 
   - Panel administrativo centralizado nativo de WordPress.
   - Gestión integral de productos simples, variables (sabores, tamaños) y agrupados (combos).
   - Control de inventario en tiempo real, precios regulares, precios de oferta y cupones.
   - Cero necesidad de programar un panel `/admin` personalizado desde cero.
2. **Zero-Friction Frontend (Next.js 14+):** 
   - Experiencia de usuario ultra veloz (Core Web Vitals óptimos, carga en < 1 segundo).
   - Estética deportiva, moderna y de alto impacto (Dark/Athletic Theme con acentos vibrantes).
   - Carrito flotante accesible en todo momento y checkout en un solo paso sin registro de cuenta (Guest Checkout).
3. **Estrategia de Combos & Deep-Linking para Redes Sociales:** 
   - Los combos se administran en WooCommerce como productos agrupados o bundles.
   - Cada combo u oferta cuenta con un enlace directo amigable para campañas de Instagram (ej: `https://maxlevel.com/?combo=COMBO_ID` o `/combo/[slug]`).
   - Al abrir el enlace, la web destaca el combo, abre un modal de vista rápida con selección de sabores y permite agregarlo al carrito con 1 clic.
4. **Persistencia Local y Resiliencia (Zustand):** 
   - El carrito se gestiona enteramente en el cliente mediante Zustand con middleware `persist` (`localStorage`).
   - Garantiza velocidad absoluta sin latencia de red en cada adición/modificación.
   - Validación final de precios y stock contra la API de WooCommerce justo antes del pago.
5. **Doble Vía de Conversión:**
   - **Checkout Automatizado:** Pago online mediante pasarela Mercado Pago (Checkout Pro / Redirect).
   - **Checkout Asistido (WhatsApp Express):** Botón alternativo para enviar el pedido formateado directamente al WhatsApp oficial del local para coordinar pagos en efectivo, transferencias o retiros presenciales.

---

## 🏗️ 2. STACK TECNOLÓGICO Y ARQUITECTURA

```
┌────────────────────────────────────────────────────────┐
│             TRAFICO SOCIAL (Instagram / Ads)           │
└──────────────────────────┬─────────────────────────────┘
                           │  /?combo=XYZ o /productos
                           ▼
┌────────────────────────────────────────────────────────┐
│        FRONTEND: Next.js 14+ App Router (Vercel)       │
│  - Server Components (Catálogo ISR / SEO)              │
│  - Client Components (Zustand Cart, Modales, Filtros)  │
│  - Route Handlers Seguros (/api/checkout, /api/reval)  │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
      REST API │ (Server-to-Server)       │ Preferences API
               ▼                          ▼
┌──────────────────────────────┐  ┌──────────────────────┐
│     BACKEND / CMS            │  │   PASARELA DE PAGO   │
│   WordPress + WooCommerce    │  │     Mercado Pago     │
│   - Catálogo & Stock         │  │   - Checkout Pro     │
│   - Gestión de Pedidos       │  │   - Tarjetas / Dinero│
└──────────────────────────────┘  └──────────────────────┘
```

### Tecnologías Core
- **Framework Frontend:** Next.js 14+ (App Router con Server Components y Server Actions).
- **Backend / CMS:** WordPress + WooCommerce (REST API `/wp-json/wc/v3`).
- **Lenguaje:** TypeScript (Modo estricto obligatorio en todo el proyecto).
- **Estilos & UI:** 
  - **Tailwind CSS:** Diseño utilitario responsivo mobile-first.
  - **Shadcn/ui (Radix UI):** Componentes accesibles y personalizables (Drawer, Dialog, Sheet, Button, Badge, Input, Toast).
  - **Lucide React:** Iconografía vectorial consistente y ligera.
  - **Framer Motion:** Micro-interacciones táctiles, animaciones del drawer de carrito y feedback visual de compra.
- **Gestión de Estado:** Zustand con `persist` para el carrito local.
- **Formularios & Validación:** React Hook Form + Zod.
- **Pasarela de Pagos:** Mercado Pago SDK / REST API (Preferences API para Checkout Pro).
- **Notificaciones:** Sonner / Toast UI para alertas de adición al carrito y errores.

---

## 📂 3. ESTRUCTURA DEL PROYECTO

```text
maxLevel/
├── context.md                    # Documento de contexto y arquitectura central
├── public/                       # Assets estáticos (logos, banners, favicons)
│   ├── logo-maxlevel.svg
│   ├── banner-combos.webp
│   └── placeholders/
├── src/
│   ├── app/                      # Next.js 14+ App Router
│   │   ├── layout.tsx            # Layout raíz (Navbar, Footer, CartDrawer, Toaster)
│   │   ├── page.tsx              # Home / Landing principal (Banners, Combos, Catálogo)
│   │   ├── productos/
│   │   │   ├── page.tsx          # Catálogo completo con filtros y buscador
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Ficha técnica individual de producto (SEO dinámico)
│   │   ├── combos/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Landing específica para combo de campaña
│   │   ├── checkout/
│   │   │   ├── page.tsx          # Pantalla de Checkout Express en 1 paso
│   │   │   └── resultado/
│   │   │       └── page.tsx      # Página de éxito / pendiente / error de pago
│   │   └── api/                  # API Routes / Route Handlers internos
│   │       ├── checkout/
│   │       │   └── mercadopago/  # Creación de preferencia de Mercado Pago y Pedido WC
│   │       │       └── route.ts
│   │       └── revalidate/       # Webhook de WooCommerce para invalidar caché ISR
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                   # Primitivos de Shadcn (button, dialog, drawer, etc.)
│   │   ├── common/               # Header, Footer, Navbar flotante, SearchBar
│   │   ├── catalog/              # ProductCard, ProductGrid, ProductFilters, CategoryTabs
│   │   ├── combos/               # ComboHero, ComboBanner, ComboModal
│   │   ├── cart/                 # CartDrawer, CartItemRow, CartSummary, FloatingCartTrigger
│   │   └── checkout/             # CheckoutForm, ShippingSelector, OrderSummaryReview
│   ├── lib/
│   │   ├── woocommerce.ts        # Cliente tipado de WooCommerce REST API
│   │   ├── mercadopago.ts        # Cliente de Mercado Pago (Preferences & Webhooks)
│   │   ├── utils.ts              # Utilidades de formato (moneda ARS, slugs, clases)
│   │   └── constants.ts          # Constantes de negocio, categorías, links oficiales
│   ├── store/
│   │   └── useCartStore.ts       # Store de Zustand con persistencia en localStorage
│   └── types/
│       ├── woocommerce.d.ts      # Tipos de Producto, Variación, Categoría, Pedido
│       ├── cart.d.ts             # Tipos de Carrito y Productos agregados
│       └── checkout.d.ts         # Esquemas de datos para formulario y pago
├── .env.example                  # Plantilla de variables de entorno
├── next.config.mjs               # Configuración de imágenes remotas y dominios permitidos
├── tailwind.config.ts            # Tokens de diseño, colores deportivos y fuentes
├── tsconfig.json                 # Configuración estricta de TypeScript
└── package.json                  # Dependencias y scripts
```

---

## 📊 4. MODELOS DE DATOS & INTERFACES PRINCIPALES (TypeScript)

### 4.1. Producto de WooCommerce (`types/woocommerce.d.ts`)
```typescript
export interface WCProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCProductAttribute {
  id: number;
  name: string; // ej: "Sabor", "Tamaño"
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[]; // ej: ["Chocolate Suizo", "Vainilla", "Frutos Rojos"]
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: 'simple' | 'variable' | 'grouped';
  status: 'publish' | 'draft';
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_quantity: number | null;
  in_stock: boolean;
  categories: WCProductCategory[];
  images: WCProductImage[];
  attributes: WCProductAttribute[];
  variations: number[];
  grouped_products?: number[]; // Para combos que agrupan otros productos
}

export interface WCProductVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  in_stock: boolean;
  stock_quantity: number | null;
  attributes: {
    id: number;
    name: string;
    option: string;
  }[];
  image?: WCProductImage;
}
```

### 4.2. Carrito de Compras (`types/cart.d.ts`)
```typescript
export interface SelectedAttribute {
  name: string;   // ej: "Sabor"
  option: string; // ej: "Frutilla"
}

export interface CartItem {
  id: string;               // Identificador único (productId + variationId + atributos seleccionados)
  productId: number;        // ID de WooCommerce
  variationId?: number;     // ID de variación si aplica
  name: string;
  slug: string;
  price: number;
  regularPrice?: number;
  image: string;
  quantity: number;
  selectedAttributes?: SelectedAttribute[];
  isCombo?: boolean;
  comboItemsSummary?: string[]; // Breve detalle de lo que incluye el combo
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

### 4.3. Checkout & Pedido (`types/checkout.d.ts`)
```typescript
export interface CustomerShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMethod: 'shipping' | 'pickup';
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
}

export interface CreateOrderPayload {
  customer: CustomerShippingData;
  items: CartItem[];
  paymentMethod: 'mercadopago' | 'whatsapp';
}
```

---

## ⚡ 5. FLUJOS CLAVE DE NEGOCIO Y EXPERIENCIA DE USUARIO

### 5.1. Landing Directa de Combos (Instagram Story / Reel to Cart)
1. **El usuario hace clic en un enlace de Instagram:** `https://maxlevel.com/?combo=1045` o `https://maxlevel.com/combos/combo-volumen-extremo`.
2. **Respuesta de la aplicación:**
   - La página lee el query param `?combo=ID` o la ruta de la landing.
   - Se abre de manera inmediata un **Modal de Combo Destacado** o **Drawer** con:
     - Título del Combo (ej: *Combo Ganador: Proteína 1kg + Creatina 300g + Shaker Pro*).
     - Descuento destacado (Badge llamativo "-20% OFF").
     - Selector rápido de sabores para cada producto que compone el combo.
     - Botón principal de alto contraste: **"¡LLEVAR COMBO AHORA!"**.
3. **Acción de 1 Clic:** Al pulsar el botón, el combo se inyecta en el carrito (Zustand + `localStorage`) y se despliega el **CartDrawer** para proceder al Checkout inmediato.

### 5.2. Carrito Flotante (Zero-Friction Cart Drawer)
- **Siempre accesible:** Botón flotante inferior (FAB) en móviles con contador visual animado (`badge` reactivo con Framer Motion).
- **Modificación instantánea:** Aumento/disminución de cantidades y eliminación sin recargas de página.
- **Barra de Envío Gratis (Gamificación):** Indicador visual interactivo: *"Agregá $X más para obtener Envío Gratis en tu compra"*.
- **Acceso rápido al Checkout:** Botón destacado en el pie del drawer que calcula el total en tiempo real.

### 5.3. Checkout Express en 1 Solo Paso
- **Sin creación de cuenta:** No se solicita usuario, contraseña ni activación por email. Solo datos indispensables de entrega y contacto (Nombre, WhatsApp, Dirección).
- **Opciones de Entrega Claras:**
  1. *Envío a Domicilio* (se solicitan calle, número, localidad y código postal).
  2. *Punto de Retiro / Sucursal* (sin costo adicional, muestra horarios y ubicación).
- **Procesamiento de Pago Dual:**
  - **Opción A (Mercado Pago):** Genera la preferencia mediante Route Handler seguro en Next.js, crea el pedido en estado `pending` en WooCommerce y redirige al usuario a Mercado Pago. Al completarse, MP redirige a `/checkout/resultado?status=approved`.
  - **Opción B (WhatsApp Directo):** Formatea el resumen del pedido con emojis, datos del cliente, productos y enlace, y abre la app de WhatsApp con el chat listo para enviar al asesor comercial de Max Level.

---

## 🔗 6. INTEGRACIÓN BACKEND (WooCommerce REST API)

### 6.1. Seguridad y Configuración de Conexión
> [!IMPORTANT]
> Las credenciales `WC_CONSUMER_KEY` y `WC_CONSUMER_SECRET` **JAMÁS** deben exponerse en el cliente (navegador). Todas las llamadas se realizan exclusivamente desde el entorno de servidor de Next.js (Server Components o Route Handlers dentro de `src/app/api`).

### 6.2. Estrategia de Caching y Revalidación (ISR)
- **Server-Side Fetching:** Las listas de productos y categorías utilizan Next.js `fetch` con caché incremental:
  ```typescript
  fetch(`${process.env.WC_API_URL}/wp-json/wc/v3/products?per_page=50`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`
    },
    next: { 
      revalidate: 3600, // Revalidación pasiva cada 1 hora
      tags: ['wc-products'] 
    }
  });
  ```
- **On-Demand Revalidation vía Webhooks:**
  - En WooCommerce se configuran dos Webhooks en `Ajustes > Avanzado > Webhooks`:
    1. *Producto Creado / Actualizado / Eliminado* (`product.updated`, `product.created`, `product.deleted`).
    2. *Inventario modificado*.
  - Apuntan a: `https://maxlevel.com/api/revalidate?secret=TU_WEBHOOK_SECRET`.
  - El Route Handler ejecuta `revalidateTag('wc-products')` al recibir la notificación, garantizando que cambios de precio o stock se reflejen en la web en menos de 2 segundos sin reconstruir la app.

---

## 💳 7. ESTRATEGIA DE PAGOS: MERCADO PAGO API

### Flujo de Creación de Preferencia (`/api/checkout/mercadopago/route.ts`)
1. **Validación en Servidor:** 
   - El endpoint recibe los items del carrito y datos del comprador.
   - Verifica precios contra WooCommerce para prevenir manipulaciones en el cliente.
2. **Creación de Pedido en WooCommerce:**
   - Se crea el pedido mediante `POST /wp-json/wc/v3/orders` en estado `pending`.
   - Se guarda el ID del pedido generado.
3. **Llamada a Mercado Pago:**
   - Se invoca la API de preferencias de Mercado Pago incluyendo:
     - `items`: Lista de productos validados con título, cantidad y precio unitario en ARS.
     - `payer`: Nombre, email y teléfono del comprador.
     - `external_reference`: El ID del pedido de WooCommerce.
     - `back_urls`: 
       - `success`: `https://maxlevel.com/checkout/resultado?status=success`
       - `pending`: `https://maxlevel.com/checkout/resultado?status=pending`
       - `failure`: `https://maxlevel.com/checkout/resultado?status=failure`
     - `auto_return`: `"approved"`
4. **Respuesta al Cliente:** 
   - Se devuelve el `init_point` (o `sandbox_init_point` en desarrollo).
   - El frontend redirige inmediatamente al usuario a la interfaz de pago de Mercado Pago.

---

## 🎨 8. DESIGN SYSTEM & UI/UX GUIDELINES

### Estética y Personalidad de Marca
- **Atmósfera:** Potente, atlética, dinámica, moderna y de alto rendimiento.
- **Paleta de Colores Primaria:**
  - **Fondo Primario:** Dark / Slate Profundo (`#0B0F17` / `#111827`).
  - **Superficie de Tarjetas:** Dark Slate Elevado (`#1E293B`).
  - **Acento Energético (High-Voltage):** Verde Neón / Lima Deportivo (`#CCFF00` o `#A3E635`) o Amarillo Volt (`#FACC15`) para llamadas a la acción (CTAs) de máxima conversión.
  - **Acento Secundario:** Rojo/Naranja Intenso (`#EF4444` / `#F97316`) para ofertas y liquidaciones urgentes ("Últimas unidades", "Hot Sale").
  - **Texto Principal:** Blanco puro (`#FFFFFF`) y Gris Claro (`#94A3B8`) para especificaciones y descripciones.
- **Tipografía:**
  - Títulos & Headings: Tipografía sans-serif audaz, de alto impacto y peso heavy (ej: *Montserrat*, *Inter Black*, o *Teko* en mayúsculas deportivas).
  - Texto de lectura y datos: *Inter* o *Geist Sans* para legibilidad perfecta en pantallas móviles pequeñas.
- **Componentes Clave de Conversión:**
  - **Badges de Oferta:** Tags visuales flotantes sobre la foto del producto (`-15% OFF`, `COMBO ESTRELLA`, `ENVÍO GRATIS`).
  - **Selector de Sabores Táctil:** Botones tipo pills o chips seleccionables con retroalimentación visual clara.
  - **Floating Cart Button:** Botón flotante inferior visible en todo momento con cantidad de items y precio acumulado.

---

## ⚙️ 9. VARIABLES DE ENTORNO (.env.example)

```env
# URL base de la aplicación Frontend
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend WooCommerce (WordPress)
WC_API_URL=https://admin.maxlevel.com
WC_CONSUMER_KEY=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WC_CONSUMER_SECRET=cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WC_WEBHOOK_SECRET=tu_secreto_para_revalidar_cache

# Pasarela de Pagos (Mercado Pago)
MP_ACCESS_TOKEN=APP_USR-XXXXXXXXXXXXXXXX-XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXX
MP_PUBLIC_KEY=APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

# Canales de Atención
NEXT_PUBLIC_WHATSAPP_PHONE=54911XXXXXXXX
NEXT_PUBLIC_INSTAGRAM_HANDLE=max.level.suplementos
```

---

## 🗺️ 10. ROADMAP DE IMPLEMENTACIÓN POR FASES

### Fase 1: Setup & Conexión Headless
- [ ] Inicialización del proyecto Next.js 14+ con TypeScript, Tailwind CSS y componentes Shadcn/ui.
- [ ] Configuración del cliente API de WooCommerce con tipos estrictos en TypeScript.
- [ ] Configuración de variables de entorno y validación de conectividad con WordPress.

### Fase 2: Catálogo de Productos & Sistema de Combos
- [ ] Creación del Grid de Productos con tarjetas optimizadas (`ProductCard`) y badges de descuento.
- [ ] Filtros interactivos por Categorías (Proteínas, Creatinas, Combos, Accesorios) y buscador en tiempo real.
- [ ] Soporte de Deep-Linking para Instagram (`/?combo=ID` o `/combos/[slug]`) con modal emergente instantáneo.
- [ ] Página de detalle individual (`/productos/[slug]`) con selector de sabores y cálculo de stock.

### Fase 3: Carrito de Compras & Persistencia Local
- [ ] Configuración del store global de Zustand con middleware `persist` en `localStorage`.
- [ ] Maquetación del `CartDrawer` lateral/inferior móvil con animaciones fluidas (Framer Motion).
- [ ] Control de cantidades, botón de vaciar carrito y cálculo dinámico de totales.
- [ ] Botón flotante inferior con badge animado al añadir productos.

### Fase 4: Checkout Express & Integraciones de Pago
- [ ] Maquetación del formulario de Checkout en 1 solo paso (React Hook Form + Zod).
- [ ] Selección entre Envío a Domicilio y Retiro en Local.
- [ ] Integración del Route Handler `/api/checkout/mercadopago` (Preferencia de MP + Creación de Pedido WC).
- [ ] Implementación de la opción de Checkout por WhatsApp con mensaje pre-armado y codificado en URL.
- [ ] Página de resultado y confirmación de compra (`/checkout/resultado`).

### Fase 5: Optimización, Webhooks & Lanzamiento
- [ ] Endpoint `/api/revalidate` para invalidación On-Demand de productos vía Webhooks de WooCommerce.
- [ ] Optimización de imágenes (`next/image`) con soporte WebP/AVIF y caching remoto.
- [ ] Pruebas end-to-end de flujo de compra completo en dispositivos móviles.
- [ ] Despliegue en producción (Vercel) y enlace en la bio de Instagram `@max.level.suplementos`.
