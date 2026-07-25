'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={handleChange}
        aria-label="Language"
        className="cyber-select !w-auto !py-2 !px-3 !pr-8 text-xs"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {l === 'zh' ? '中文' : 'EN'}
          </option>
        ))}
      </select>
    </div>
  );
}
