import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import CompareContent from '@/components/compare/CompareContent';

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-cyber-blue animate-pulse">
            {t('searching')}
          </p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
