// 品牌标识（小写 key，对应 i18n 的 brandOptions）
export type BrandKey =
  | 'apple'
  | 'samsung'
  | 'xiaomi'
  | 'huawei'
  | 'oneplus'
  | 'google'
  | 'oppo'
  | 'vivo';

// 价格来源标识（对应 i18n 的 priceSources）
export type PriceSourceKey = 'taobao' | 'jd' | 'official';

export interface Phone {
  id: string;
  brand: BrandKey; // 品牌
  model: string; // 型号
  ram: number; // 内存 (GB)
  storage: number; // 存储 (GB)
  releaseYear: number; // 上市年份
  price: number; // 价格 (CNY)
  priceSource: PriceSourceKey; // 价格来源
  priceUpdated: string; // 格式 YYYY-MM-DD（必须在一周内）
  screen: string; // 屏幕参数
  battery: string; // 电池参数
  processor: string; // 处理器
  camera: string; // 摄像头参数
  image?: string; // (可选) 图片链接
}

export interface FilterOptions {
  ram?: number;
  storage?: number;
  brand?: BrandKey;
  releaseYear?: number;
  priceRange?: string; // 格式 "min-max"
}

// 筛选器可选值常量，供 UI 渲染下拉菜单使用
export const RAM_OPTIONS = [8, 12, 16, 24] as const;
export const STORAGE_OPTIONS = [32, 64, 128, 256, 512, 1024, 2048] as const;
export const BRAND_OPTIONS: BrandKey[] = [
  'apple',
  'samsung',
  'xiaomi',
  'huawei',
  'oneplus',
  'google',
  'oppo',
  'vivo',
];
export const RELEASE_YEAR_OPTIONS = [2024, 2025, 2026] as const;
export const PRICE_RANGE_OPTIONS = [
  '0-3000',
  '3000-5000',
  '5000-8000',
  '8000-12000',
  '12000-99999',
] as const;
