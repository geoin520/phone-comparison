'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 border-b border-cyber-dark-border bg-cyber-dark/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-md border border-cyber-blue/50 bg-cyber-dark-card">
            <span className="font-mono text-lg font-bold text-neon-blue">P</span>
            <span className="absolute inset-0 rounded-md animate-pulse-glow" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-base font-bold tracking-tight text-cyber-text group-hover:text-neon-blue transition-colors">
              PhoneComparison
              <span className="text-neon-pink">.ing</span>
            </span>
            <span className="hidden text-[11px] text-cyber-muted sm:inline">
              {t('subtitle')}
            </span>
          </div>
        </Link>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
