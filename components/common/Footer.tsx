import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="mt-20 border-t border-cyber-dark-border bg-cyber-dark-card/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-cyber-text">
            PhoneComparison<span className="text-neon-pink">.ing</span>
          </span>
          <span className="text-cyber-muted">·</span>
          <span className="text-xs text-cyber-muted">2026</span>
        </div>
        <p className="font-mono text-xs text-cyber-muted">{t('footer')}</p>
      </div>
    </footer>
  );
}
