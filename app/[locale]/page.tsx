import { setRequestLocale, getTranslations } from 'next-intl/server';
import FilterSection from '@/components/home/FilterSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* 背景网格 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-lines bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      {/* Hero */}
      <div className="relative mb-12 text-center animate-fade-in-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyber-blue/30 bg-cyber-dark-card/60 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyber-blue animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-cyber-blue">
            Vibe Coding · AI Driven
          </span>
        </div>
        <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-cyber-text">PhoneComparison</span>
          <span className="text-neon-pink">.ing</span>
        </h1>
        <p className="mt-4 text-lg text-neon-blue sm:text-xl">{t('subtitle')}</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-cyber-muted sm:text-base">
          {t('description')}
        </p>
      </div>

      {/* 筛选区 */}
      <div className="relative">
        <FilterSection />
      </div>

      {/* 数据说明 */}
      <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { num: '28+', key: 'common.title' },
          { num: '8', key: 'filters.brand' },
          { num: '7d', key: 'common.updated' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="cyber-card flex flex-col items-center gap-1 p-4 text-center"
          >
            <span className="font-mono text-2xl font-bold text-neon-blue">
              {item.num}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-cyber-muted">
              {item.key === 'common.title'
                ? t('specs')
                : item.key === 'filters.brand'
                  ? t('brand')
                  : t('updated')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
