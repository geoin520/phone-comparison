'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { buildQueryString } from '@/lib/utils/filter';
import {
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  BRAND_OPTIONS,
  RELEASE_YEAR_OPTIONS,
  PRICE_RANGE_OPTIONS,
  type BrandKey,
  type FilterOptions,
} from '@/types';

export default function FilterSection() {
  const t = useTranslations('common');
  const tf = useTranslations('filters');
  const tRam = useTranslations('ramOptions');
  const tStorage = useTranslations('storageOptions');
  const tBrand = useTranslations('brandOptions');
  const tYear = useTranslations('releaseYearOptions');
  const tPrice = useTranslations('priceRangeOptions');
  const router = useRouter();

  const [filters, setFilters] = useState<FilterOptions>({});

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === '') {
        delete next[key];
      } else if (key === 'ram' || key === 'storage' || key === 'releaseYear') {
        next[key] = Number(value) as never;
      } else if (key === 'brand') {
        next[key] = value as BrandKey;
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  // 自定义型号关键词：空字符串视为未筛选
  const updateKeyword = (value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value.trim() === '') {
        delete next.keyword;
      } else {
        next.keyword = value;
      }
      return next;
    });
  };

  const activeCount = Object.keys(filters).length;

  const handleCompare = () => {
    const qs = buildQueryString(filters);
    router.push(`/compare${qs}`);
  };

  const fields: Array<{
    key: keyof FilterOptions;
    label: string;
    options: ReadonlyArray<string | number>;
    labelOf: (v: string) => string;
    valueOf: (v: string | number) => string;
  }> = [
    {
      key: 'ram',
      label: tf('ram'),
      options: RAM_OPTIONS,
      labelOf: (v) => tRam(v),
      valueOf: (v) => String(v),
    },
    {
      key: 'storage',
      label: tf('storage'),
      options: STORAGE_OPTIONS,
      labelOf: (v) => tStorage(v),
      valueOf: (v) => String(v),
    },
    {
      key: 'brand',
      label: tf('brand'),
      options: BRAND_OPTIONS,
      labelOf: (v) => tBrand(v),
      valueOf: (v) => String(v),
    },
    {
      key: 'releaseYear',
      label: tf('releaseYear'),
      options: RELEASE_YEAR_OPTIONS,
      labelOf: (v) => tYear(v),
      valueOf: (v) => String(v),
    },
    {
      key: 'priceRange',
      label: tf('priceRange'),
      options: PRICE_RANGE_OPTIONS,
      labelOf: (v) => tPrice(v),
      valueOf: (v) => String(v),
    },
  ];

  return (
    <section className="cyber-card scanline-wrapper p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyber-blue animate-pulse" />
          <h2 className="font-mono text-sm uppercase tracking-widest text-cyber-blue">
            {t('filters')}
          </h2>
        </div>
        {activeCount > 0 && (
          <span className="badge border-cyber-pink/50 text-cyber-pink">
            {activeCount} / 6
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => {
          const current = filters[field.key];
          const currentValue = current !== undefined ? String(current) : '';
          return (
            <div key={field.key} className="flex flex-col gap-2">
              <label
                htmlFor={`filter-${field.key}`}
                className="font-mono text-xs uppercase tracking-wider text-cyber-muted"
              >
                {field.label}
              </label>
              <select
                id={`filter-${field.key}`}
                className="cyber-select"
                value={currentValue}
                onChange={(e) => updateFilter(field.key, e.target.value)}
              >
                <option value="">{t('all')}</option>
                {field.options.map((opt) => {
                  const val = field.valueOf(opt);
                  return (
                    <option key={val} value={val}>
                      {field.labelOf(val)}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}

        {/* 自定义型号输入 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-keyword"
            className="font-mono text-xs uppercase tracking-wider text-cyber-muted"
          >
            {tf('keyword')}
          </label>
          <input
            id="filter-keyword"
            type="text"
            value={filters.keyword ?? ''}
            onChange={(e) => updateKeyword(e.target.value)}
            placeholder={tf('keywordPlaceholder')}
            className="cyber-input"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button onClick={handleCompare} className="btn-neon w-full sm:w-auto">
          <span className="text-lg">{t('compareNow')}</span>
          <span aria-hidden className="text-lg">→</span>
        </button>
        <p className="font-mono text-xs text-cyber-muted">
          {t('description')}
        </p>
      </div>
    </section>
  );
}
