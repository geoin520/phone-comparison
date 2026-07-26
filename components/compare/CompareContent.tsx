'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { parseFiltersFromParams } from '@/lib/utils/filter';
import ComparisonTable, { EmptyState } from '@/components/compare/ComparisonTable';
import { Link } from '@/i18n/navigation';
import type { Phone } from '@/types';

interface ApiResponse {
  count: number;
  results: Phone[];
  source: 'github' | 'fallback';
  cached: boolean;
  error?: string;
}

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
  const tData = useTranslations('dataSource');
  const locale = useLocale();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const filters = parseFiltersFromParams(new URLSearchParams(searchParams.toString()));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams(searchParams.toString());
    fetch(`/api/compare?${params.toString()}`)
      .then((r) => r.json())
      .then((d: ApiResponse) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData({ count: 0, results: [], source: 'fallback', cached: false, error: 'Network error' });
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const results = data?.results ?? [];
  const source = data?.source ?? 'fallback';

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
  if (filters.keyword !== undefined && filters.keyword.trim() !== '')
    activeChips.push({ label: tf('keyword'), value: filters.keyword });

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
            {loading
              ? t('searching')
              : results.length > 0
                ? tc('results')
                : t('noResults')}
          </h1>
          {!loading && results.length > 0 && (
            <p className="mt-1 font-mono text-sm text-cyber-muted">
              {t('resultsCount', { count: results.length })}
            </p>
          )}
        </div>
        <Link href="/" className="btn-ghost self-start sm:self-auto">
          ← {t('backHome')}
        </Link>
      </div>

      {/* 数据来源标识 */}
      {!loading && (
        <div className="mb-4 flex items-center gap-2">
          {source === 'github' ? (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-green-500/30 bg-green-500/5 px-3 py-1 font-mono text-xs text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              {tData('liveSource')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 font-mono text-xs text-yellow-400">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              {tData('fallbackSource')}
            </span>
          )}
        </div>
      )}

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

      {/* 加载状态 */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-cyber-blue/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyber-blue" />
            <div className="absolute inset-2 animate-pulse rounded-full bg-cyber-blue/10" />
          </div>
          <p className="font-mono text-sm text-cyber-muted">{tData('loadingHint')}</p>
        </div>
      )}

      {/* 结果 */}
      {!loading && results.length > 0 ? (
        <ComparisonTable phones={results} />
      ) : null}

      {/* 空状态 */}
      {!loading && results.length === 0 && <EmptyState />}

      {/* 价格时效性说明 */}
      {!loading && results.length > 0 && (
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
