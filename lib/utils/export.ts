/**
 * 对比结果导出工具
 * 支持 CSV 格式导出，带 UTF-8 BOM 以兼容 Excel 正确显示中文
 */
import type { Phone } from '@/types';
import { formatPrice, formatStorage, formatReleaseDate } from './helpers';

/** CSV 字段转义：含逗号、引号或换行时用双引号包裹，内部双引号转义为两个双引号 */
function escapeCsv(value: string | number): string {
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export interface ExportOptions {
  locale: string;
  /** 本地化标签表 */
  labels: {
    brand: string;
    model: string;
    releaseDate: string;
    ram: string;
    storage: string;
    screen: string;
    battery: string;
    processor: string;
    camera: string;
    price: string;
    priceSource: string;
    priceUpdated: string;
  };
  /** 品牌本地化映射函数 */
  brandLabel: (b: Phone['brand']) => string;
  /** 价格来源本地化映射函数 */
  sourceLabel: (s: Phone['priceSource']) => string;
}

/**
 * 将对比结果生成 CSV 字符串
 * 表头为参数名，每行为一款手机
 */
export function phonesToCsv(phones: Phone[], opts: ExportOptions): string {
  const { labels, brandLabel, sourceLabel, locale } = opts;
  const header = [
    labels.brand,
    labels.model,
    labels.releaseDate,
    labels.ram,
    labels.storage,
    labels.screen,
    labels.battery,
    labels.processor,
    labels.camera,
    labels.price,
    labels.priceSource,
    labels.priceUpdated,
  ];

  const lines = [header.map(escapeCsv).join(',')];

  for (const p of phones) {
    const row = [
      brandLabel(p.brand),
      p.model,
      formatReleaseDate(p.releaseYear, p.releaseMonth, locale),
      `${p.ram} GB`,
      formatStorage(p.storage, locale),
      p.screen,
      p.battery,
      p.processor,
      p.camera,
      formatPrice(p.price, locale),
      sourceLabel(p.priceSource),
      p.priceUpdated,
    ];
    lines.push(row.map(escapeCsv).join(','));
  }

  // UTF-8 BOM 头，确保 Excel 正确识别中文
  return '\uFEFF' + lines.join('\r\n');
}

/**
 * 触发浏览器下载 CSV 文件
 */
export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // 释放 URL 对象
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
