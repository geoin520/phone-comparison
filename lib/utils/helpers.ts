/**
 * 格式化存储容量：>=1024 时以 TB 显示，否则 GB
 */
export function formatStorage(gb: number, locale: string): string {
  if (gb >= 1024) {
    const tb = gb / 1024;
    return `${tb} TB`;
  }
  return `${gb} GB`;
}

/**
 * 格式化价格：中文用 ¥，英文用 $
 * 简易汇率 1 CNY ≈ 0.137 USD
 */
export function formatPrice(cny: number, locale: string): string {
  if (locale === 'en') {
    const usd = Math.round(cny * 0.137);
    return `$${usd.toLocaleString('en-US')}`;
  }
  return `¥${cny.toLocaleString('zh-CN')}`;
}

/**
 * 价格时效性校验：距离当前日期 <= 7 天视为可信
 */
export function isPriceFresh(dateStr: string): boolean {
  const updated = new Date(dateStr);
  if (Number.isNaN(updated.getTime())) return false;
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 7 && diffDays >= -1;
}

/**
 * 格式化日期为本地化展示
 */
export function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化上市时间（精确到月份）
 * 中文：2025年2月；英文：Feb 2025
 */
export function formatReleaseDate(
  year: number,
  month: number | undefined,
  locale: string,
): string {
  if (!year) return '-';
  if (!month || month < 1 || month > 12) return `${year}`;
  if (locale === 'en') {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${monthNames[month - 1]} ${year}`;
  }
  return `${year}年${month}月`;
}
