'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Phone } from '@/types';
import { formatPrice, formatStorage, formatDate, formatReleaseDate, isPriceFresh } from '@/lib/utils/helpers';
import { Link } from '@/i18n/navigation';

export default function ComparisonTable({ phones }: { phones: Phone[] }) {
  const t = useTranslations('common');
  const tc = useTranslations('compare');
  const tBrand = useTranslations('brandOptions');
  const tSource = useTranslations('priceSources');
  const locale = useLocale();

  const rows: Array<{
    key: string;
    label: string;
    render: (p: Phone) => React.ReactNode;
    accent?: boolean;
  }> = [
    {
      key: 'brand',
      label: t('brand'),
      render: (p) => (
        <span className="badge border-cyber-blue/40 text-cyber-blue">
          {tBrand(p.brand)}
        </span>
      ),
    },
    {
      key: 'model',
      label: tc('model'),
      render: (p) => <span className="font-semibold text-cyber-text">{p.model}</span>,
    },
    {
      key: 'releaseDate',
      label: tc('releaseDate'),
      render: (p) => (
        <span className="font-mono text-sm text-cyber-text">
          {formatReleaseDate(p.releaseYear, p.releaseMonth, locale)}
        </span>
      ),
    },
    {
      key: 'ram',
      label: tc('ram'),
      render: (p) => <span className="font-mono text-cyber-blue">{p.ram} GB</span>,
    },
    {
      key: 'storage',
      label: tc('storage'),
      render: (p) => (
        <span className="font-mono text-cyber-blue">{formatStorage(p.storage, locale)}</span>
      ),
    },
    {
      key: 'screen',
      label: tc('screen'),
      render: (p) => <span className="font-mono text-sm text-cyber-text">{p.screen}</span>,
    },
    {
      key: 'battery',
      label: tc('battery'),
      render: (p) => <span className="font-mono text-sm text-cyber-text">{p.battery}</span>,
    },
    {
      key: 'processor',
      label: tc('processor'),
      render: (p) => <span className="font-mono text-sm text-cyber-text">{p.processor}</span>,
    },
    {
      key: 'camera',
      label: tc('camera'),
      render: (p) => <span className="font-mono text-xs text-cyber-muted">{p.camera}</span>,
    },
    {
      key: 'price',
      label: tc('price'),
      accent: true,
      render: (p) => (
        <span className="font-mono text-base font-bold text-neon-pink">
          {formatPrice(p.price, locale)}
        </span>
      ),
    },
    {
      key: 'priceSource',
      label: t('priceSource'),
      render: (p) => {
        const colors: Record<string, string> = {
          taobao: 'border-cyber-pink/50 text-cyber-pink',
          jd: 'border-cyber-blue/50 text-cyber-blue',
          official: 'border-cyber-purple/60 text-[#b066ff]',
        };
        return (
          <span className={`badge ${colors[p.priceSource] ?? ''}`}>
            {tSource(p.priceSource)}
          </span>
        );
      },
    },
    {
      key: 'priceUpdated',
      label: t('updated'),
      render: (p) => {
        const fresh = isPriceFresh(p.priceUpdated);
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-cyber-muted">
            {formatDate(p.priceUpdated, locale)}
            {fresh && (
              <span
                title={t('verified')}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20 text-green-400"
              >
                ✓
              </span>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <div className="cyber-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-[120px] border-b border-cyber-dark-border bg-cyber-dark-card/95 px-4 py-4 text-left align-bottom">
                <span className="font-mono text-xs uppercase tracking-widest text-cyber-muted">
                  {tc('results')}
                </span>
              </th>
              {phones.map((p) => (
                <th
                  key={p.id}
                  className="min-w-[200px] border-b border-l border-cyber-dark-border px-4 py-4 text-left align-bottom"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-cyber-blue/70">
                      {tBrand(p.brand)}
                    </span>
                    <span className="font-mono text-base font-bold text-cyber-text">
                      {p.model}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.key}
                className={
                  rowIdx % 2 === 0
                    ? 'bg-cyber-dark-card/40'
                    : 'bg-transparent'
                }
              >
                <td
                  className={`sticky left-0 z-10 border-b border-cyber-dark-border bg-cyber-dark-card/95 px-4 py-3.5 align-middle ${
                    row.accent ? 'font-mono text-xs uppercase tracking-wider text-neon-pink' : 'font-mono text-xs uppercase tracking-wider text-cyber-muted'
                  }`}
                >
                  {row.label}
                </td>
                {phones.map((p) => (
                  <td
                    key={`${row.key}-${p.id}`}
                    className={`border-b border-l border-cyber-dark-border px-4 py-3.5 align-middle ${
                      row.accent ? 'bg-cyber-pink/[0.03]' : ''
                    }`}
                  >
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EmptyState() {
  const t = useTranslations('common');
  return (
    <div className="cyber-card flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyber-pink/40 bg-cyber-dark">
        <span className="font-mono text-4xl text-cyber-pink">!</span>
        <span className="absolute inset-0 rounded-full animate-pulse-glow" />
      </div>
      <h3 className="font-mono text-xl font-bold text-cyber-text">{t('noResults')}</h3>
      <p className="font-mono text-sm text-cyber-muted">{t('noResultsHint')}</p>
      <Link href="/" className="btn-ghost mt-2">
        ← {t('backHome')}
      </Link>
    </div>
  );
}
