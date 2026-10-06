'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { WCProduct } from '@/types/woocommerce';
import ComboModal from './ComboModal';

interface ComboUrlParamListenerProps {
  products: WCProduct[];
}

export default function ComboUrlParamListener({ products }: ComboUrlParamListenerProps) {
  const searchParams = useSearchParams();
  const comboParam = searchParams.get('combo');
  const [activeCombo, setActiveCombo] = useState<WCProduct | null>(null);

  useEffect(() => {
    if (!comboParam) return;

    // Buscar por ID numérico o por slug
    const matched = products.find(
      (p) =>
        String(p.id) === comboParam ||
        p.slug.toLowerCase() === comboParam.toLowerCase()
    );

    if (matched) {
      setActiveCombo(matched);
    }
  }, [comboParam, products]);

  if (!activeCombo) return null;

  return (
    <ComboModal
      combo={activeCombo}
      isOpen={Boolean(activeCombo)}
      onClose={() => setActiveCombo(null)}
    />
  );
}
