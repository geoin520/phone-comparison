'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { phones } from '@/lib/data/phones';
import { filterPhones, parseFiltersFromParams } from '@/lib/utils/filter';
import ComparisonTable, { EmptyState } from '@/components/compare/ComparisonTable';
import { Link } from '@/i18n/navigation';

export default function CompareContent() {
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const tc = useTranslations('compare');
  const tf = useTranslations('filters');
  const tBrand = useTranslations('brandOptions');
  const tRam = useTranslations('ramOptions');
  const tStorage = useTranslations('storageOptions');
  const tYear = useTranslations('releaseYearOptions');
  const tPrice = useTranslations('priceRangeOptions');
  const locale = useLocale();

  const filters = parseFiltersFromParams(new URLSearchParams(searchParams.toString()));
  const results = filterPhones(phones, filters);

  const activeChips: Array<{ label: string; value: string }> = [];
  if (filters.ram !== undefined)
    activeChips.push({ label: tf('ram'), value: tRam(String(filters.ram)) });
  if (filters.storage !== undefined)
    activeChips.push({ label: tf('storage'), value: tStorage(String(filters.storage)) });
  if (filters.brand !== undefined)
    activeChips.push({ label: tf('brand'), value: tBrand(filters.brand!) });
  if (filters.releaseYear !== undefined)
    activeChips.push({ label: tf('releaseYear'), value: tYear(String(filters.releaseYear)) });
  if (filters.priceRange !== undefined)
    activeChips.push({ label: tf('priceRange'), value: tPrice(filters.priceRange!) });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* 头部 */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyber-pink animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-cyber-pink">
              {t('specs')}
            </span>
          </div>
          <h1 className="font-mono text-2xl font-bold text-cyber-text sm:text-3xl">
            {results.length > 0 ? tc('results') : t('noResults')}
          </h1>
          {results.length > 0 && (
            <p className="mt-1 font-mono text-sm text-cyber-muted">
              {t('resultsCount', { count: results.length })}
            </p>
          )}
        </div>
        <Link href="/" className="btn-ghost self-start sm:self-auto">
          ← {t('backHome')}
        </Link>
      </div>

      {/* 活动筛选条件 */}
      {activeChips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-cyber-muted">
            {t('filters')}:
          </span>
          {activeChips.map((chip, idx) => (
            <span
              key={idx}
              className="badge border-cyber-blue/40 bg-cyber-blue/5 text-cyber-blue"
            >
              <span className="opacity-60">{chip.label}</span>
              <span className="font-bold">{chip.value}</span>
            </span>
          ))}
        </div>
      )}

      {/* 结果 */}
      {results.length > 0 ? (
        <ComparisonTable phones={results} />
      ) : (
        <EmptyState />
      )}

      {/* 价格时效性说明 */}
      {results.length > 0 && (
        <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-cyber-muted">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20 text-green-400">
            ✓
          </span>
          {t('verified')} · {locale === 'en' ? 'USD' : 'CNY'}
        </p>
      )}
    </div>
  );
}
