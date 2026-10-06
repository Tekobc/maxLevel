'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

function ResultadoContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('order_id') || searchParams.get('external_reference');
  const collectionId = searchParams.get('collection_id');

  const isApproved = status === 'approved' || status === 'success';
  const isPending = status === 'pending';
  const isWhatsAppPending = status === 'whatsapp_pending';

  return (
    <div className="mx-auto max-w-xl text-center py-12 px-4">
      {/* Icono de Estado */}
      <div className="mb-6 flex justify-center">
        {isApproved ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        ) : isPending || isWhatsAppPending ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <Clock className="h-12 w-12" />
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-400">
            <AlertTriangle className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Titulares y Mensajes */}
      {isApproved ? (
        <>
          <span className="text-xs font-black tracking-widest text-brand-neon uppercase">
            PAGO ACREDITADO CON ÉXITO
          </span>
          <h1 className="mt-2 text-3xl font-black italic tracking-tight text-white uppercase sm:text-4xl">
            ¡GRACIAS POR TU COMPRA EN MAX LEVEL!
          </h1>
          <p className="mt-3 text-sm text-zinc-300">
            Tu pedido ya está siendo preparado en nuestro depósito. Te enviaremos el comprobante y el código de seguimiento por email y WhatsApp.
          </p>
        </>
      ) : isWhatsAppPending ? (
        <>
          <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
            PEDIDO ENVIADO POR WHATSAPP
          </span>
          <h1 className="mt-2 text-3xl font-black italic tracking-tight text-white uppercase sm:text-4xl">
            COORDINACIÓN EN CURSO
          </h1>
          <p className="mt-3 text-sm text-zinc-300">
            Un asesor comercial se comunicará en breve por WhatsApp para confirmar los datos y finalizar el despacho o retiro.
          </p>
        </>
      ) : isPending ? (
        <>
          <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
            PAGO PENDIENTE DE ACREDITACIÓN
          </span>
          <h1 className="mt-2 text-3xl font-black italic tracking-tight text-white uppercase sm:text-4xl">
            ESTAMOS PROCESANDO TU PAGO
          </h1>
          <p className="mt-3 text-sm text-zinc-300">
            Si pagaste con Rapipago, Pago Fácil o transferencia, tu pedido se activará apenas se acrediten los fondos.
          </p>
        </>
      ) : (
        <>
          <span className="text-xs font-black tracking-widest text-red-400 uppercase">
            NO PUDIMOS COMPLETAR EL PAGO
          </span>
          <h1 className="mt-2 text-3xl font-black italic tracking-tight text-white uppercase sm:text-4xl">
            HUBO UN PROBLEMA CON TU TARJETA
          </h1>
          <p className="mt-3 text-sm text-zinc-300">
            Podés reintentar con otro medio de pago o escribirnos a WhatsApp para coordinar una transferencia bancaria directa.
          </p>
        </>
      )}

      {/* Referencias */}
      {(orderId || collectionId) && (
        <div className="mt-6 rounded-2xl border border-surface-border bg-surface p-4 text-xs text-zinc-400">
          {orderId && <div>N° de Pedido: <strong className="text-white">#{orderId}</strong></div>}
          {collectionId && <div className="mt-1">ID Transacción Mercado Pago: <strong className="text-white">{collectionId}</strong></div>}
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-brand-neon px-6 py-3.5 text-xs sm:text-sm font-black uppercase text-black shadow-neon-sm hover:scale-105 transition-all"
        >
          <span>VOLVER AL INICIO</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <a
          href={`https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${encodeURIComponent(
            `Hola! Quisiera consultar sobre el estado de mi pedido ${orderId ? `#${orderId}` : ''}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-surface-border bg-surface px-6 py-3.5 text-xs sm:text-sm font-bold text-emerald-400 hover:text-white transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-zinc-400">Cargando resultado...</div>}>
      <ResultadoContent />
    </Suspense>
  );
}
