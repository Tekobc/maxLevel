import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CartItem } from '@/types/cart';
import { CustomerShippingData } from '@/types/checkout';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '$0';

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export function generateWhatsAppOrderUrl(
  phone: string,
  items: CartItem[],
  total: number,
  customer?: CustomerShippingData
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  let message = `🔥 *NUEVO PEDIDO — MAX LEVEL SUPLEMENTOS* 🔥\n\n`;

  if (customer) {
    message += `👤 *Cliente:* ${customer.firstName} ${customer.lastName}\n`;
    message += `📱 *Teléfono:* ${customer.phone}\n`;
    message += `📧 *Email:* ${customer.email}\n`;
    message += `📦 *Entrega:* ${customer.deliveryMethod === 'shipping' ? 'Envío a Domicilio' : 'Retiro en Sucursal'}\n`;

    if (customer.deliveryMethod === 'shipping' && customer.address) {
      message += `📍 *Dirección:* ${customer.address}, ${customer.city || ''} (CP: ${customer.postalCode || ''})\n`;
    }
    if (customer.notes) {
      message += `📝 *Notas:* ${customer.notes}\n`;
    }
    message += `\n--------------------------------\n`;
  }

  message += `🛒 *DETALLE DEL PEDIDO:*\n`;
  items.forEach((item, index) => {
    message += `\n*${index + 1}. ${item.name}* x${item.quantity}\n`;
    if (item.selectedAttributes && item.selectedAttributes.length > 0) {
      item.selectedAttributes.forEach((attr) => {
        message += `   ▫️ ${attr.name}: ${attr.option}\n`;
      });
    }
    if (item.comboItemsSummary && item.comboItemsSummary.length > 0) {
      message += `   ▫️ Incluye: ${item.comboItemsSummary.join(' + ')}\n`;
    }
    message += `   💰 Subtotal: ${formatCurrency(item.price * item.quantity)}\n`;
  });

  message += `\n--------------------------------\n`;
  message += `*TOTAL A PAGAR: ${formatCurrency(total)}*\n\n`;
  message += `🚀 _¡Hola! Quiero confirmar este pedido y coordinar el pago / envío._`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
