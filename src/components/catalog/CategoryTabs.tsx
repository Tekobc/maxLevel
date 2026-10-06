'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/constants';

interface CategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
}

export default function CategoryTabs({
  activeCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 pt-1">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category.slug;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.slug)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all ${
              isActive
                ? 'bg-brand-neon text-black shadow-neon-sm scale-105'
                : 'border border-surface-border bg-surface text-zinc-300 hover:border-zinc-500 hover:text-white'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
