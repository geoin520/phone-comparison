/**
 * GitHub 手机规格数据源
 *
 * 数据来源: AnarDevStudio/PhoneSpecsAPI (https://github.com/AnarDevStudio/PhoneSpecsAPI)
 * 通过 GitHub Contents API 获取各品牌手机规格 JSON 数据
 * 该数据库包含 Apple(46)、Samsung(138)、Xiaomi(97)、Huawei(43)、Google(18) 等品牌
 *
 * 数据结构示例:
 * {
 *   "brand": "Apple",
 *   "model": "iPhone 16",
 *   "release_year": 2024,
 *   "price": 799,           // USD
 *   "hardware": {
 *     "ram": "8GB",
 *     "storage": ["128GB","256GB","512GB"],
 *     "cpu": "Apple A18 Bionic",
 *     "screen": { "size": "6.1 inch", "resolution": "2556x1179", "refresh_rate": "60Hz" },
 *     "battery": { "capacity": "unknown", "fast_charging": "Yes", "wireless_charging": true }
 *   },
 *   "camera": { "rear": { "main": "48MP" }, "front": { "main": "12MP" } }
 * }
 */

import type { Phone, BrandKey } from '@/types';

/** GitHub 数据源配置 */
const GITHUB_REPO = 'AnarDevStudio/PhoneSpecsAPI';
const GITHUB_DATA_PATH = 'data';

/** 品牌映射：我们的品牌 key -> GitHub 文件名 */
const BRAND_FILE_MAP: Record<string, string> = {
  apple: 'apple_data.json',
  samsung: 'samsung_data.json',
  xiaomi: 'xiaomi_data.json',
  huawei: 'huawei_data.json',
  google: 'google_data.json',
};

/** 所有可获取的品牌文件列表（含本地未预置的品牌） */
const ALL_BRAND_FILES: Array<{ brand: string; file: string }> = [
  { brand: 'apple', file: 'apple_data.json' },
  { brand: 'samsung', file: 'samsung_data.json' },
  { brand: 'xiaomi', file: 'xiaomi_data.json' },
  { brand: 'huawei', file: 'huawei_data.json' },
  { brand: 'google', file: 'google_data.json' },
  { brand: 'nokia', file: 'nokia_data.json' },
];

/** 内存缓存：{ brand -> { data, fetchedAt } } */
const cache = new Map<string, { data: RawPhone[]; fetchedAt: number }>();

/** 缓存有效期：10 分钟 */
const CACHE_TTL = 10 * 60 * 1000;

/** GitHub API 原始手机数据类型 */
interface RawPhone {
  brand: string;
  model: string;
  release_year?: number;
  release_month?: number;
  price?: number;
  hardware?: {
    ram?: string;
    storage?: string[];
    cpu?: string;
    gpu?: string;
    screen?: {
      size?: string;
      resolution?: string;
      refresh_rate?: string;
    };
    battery?: {
      capacity?: string;
      fast_charging?: string;
      wireless_charging?: boolean;
    };
  };
  camera?: {
    rear?: { main?: string; features?: string[] };
    front?: { main?: string; features?: string[] };
  };
  colors?: string[];
  features?: string[];
}

/**
 * 从 GitHub API 获取指定品牌的手机数据
 * 使用 Contents API 的 raw 内容模式
 */
async function fetchBrandData(brand: string): Promise<RawPhone[]> {
  const brandFile = BRAND_FILE_MAP[brand] || `${brand}_data.json`;
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_DATA_PATH}/${brandFile}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'PhoneComparison/1.0',
      Accept: 'application/vnd.github.v3.raw+json',
    },
  });

  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`GitHub API ${res.status}: ${res.statusText} for ${brand}`);
  }

  const text = await res.text();
  const json = JSON.parse(text);
  const phones: RawPhone[] = json.phones || [];
  return phones;
}

/**
 * 获取指定品牌的手机数据（带缓存）
 */
async function getBrandPhones(brand: string): Promise<RawPhone[]> {
  const cached = cache.get(brand);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchBrandData(brand);
  cache.set(brand, { data, fetchedAt: Date.now() });
  return data;
}

/**
 * 获取所有品牌的手机数据
 */
export async function getAllRawPhones(): Promise<RawPhone[]> {
  const results = await Promise.allSettled(
    ALL_BRAND_FILES.map((item) => getBrandPhones(item.brand)),
  );

  const all: RawPhone[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      all.push(...r.value);
    }
  }
  return all;
}

/**
 * 按关键词搜索手机（模糊匹配 brand + model）
 */
export async function searchRawPhones(keyword: string): Promise<RawPhone[]> {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return [];

  const all = await getAllRawPhones();
  return all.filter((p) => {
    const hay = `${p.brand} ${p.model}`.toLowerCase();
    return hay.includes(kw);
  });
}

/**
 * 解析 RAM 字符串为数字 (GB)
 * "8GB" -> 8, "128MB" -> 0 (不到 1GB), "12 GB" -> 12
 */
function parseRam(ramStr?: string): number {
  if (!ramStr) return 0;
  const match = ramStr.match(/(\d+)\s*gb/i);
  if (match) return parseInt(match[1], 10);
  // MB 级别换算
  const mbMatch = ramStr.match(/(\d+)\s*mb/i);
  if (mbMatch) return Math.round(parseInt(mbMatch[1], 10) / 1024);
  return 0;
}

/**
 * 解析存储容量字符串数组，取第一个值 (GB)
 * ["128GB","256GB"] -> 128
 */
function parseStorage(storageArr?: string[]): number {
  if (!storageArr || storageArr.length === 0) return 0;
  const first = storageArr[0];
  const match = first.match(/(\d+)\s*gb/i);
  if (match) return parseInt(match[1], 10);
  const tbMatch = first.match(/(\d+)\s*tb/i);
  if (tbMatch) return parseInt(tbMatch[1], 10) * 1024;
  return 0;
}

/**
 * 将价格从 USD 转换为 CNY（粗略汇率 7.2）
 */
function usdToCny(usd: number): number {
  return Math.round(usd * 7.2);
}

/**
 * 将 GitHub 原始数据转换为项目 Phone 类型
 */
function convertToPhone(raw: RawPhone, index: number): Phone {
  const brand = (raw.brand || '').toLowerCase() as BrandKey;
  const model = raw.model || `Unknown ${index}`;
  const id = `${brand}-${model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;

  const ram = parseRam(raw.hardware?.ram);
  const storage = parseStorage(raw.hardware?.storage);
  const releaseYear = raw.release_year || 0;
  const releaseMonth =
    raw.release_month && raw.release_month >= 1 && raw.release_month <= 12
      ? raw.release_month
      : undefined;
  const priceUsd = raw.price || 0;
  const priceCny = priceUsd > 0 ? usdToCny(priceUsd) : 0;

  const screenSize = raw.hardware?.screen?.size
    ? `${raw.hardware.screen.size.replace('inch', '"').trim()}`
    : '';
  const resolution = raw.hardware?.screen?.resolution || '';
  const refreshRate = raw.hardware?.screen?.refresh_rate || '';
  const screen = [screenSize, resolution, refreshRate].filter(Boolean).join(' ') || '-';

  const batteryCapacity = raw.hardware?.battery?.capacity || '-';

  const processor = raw.hardware?.cpu || '-';

  const rearCam = raw.camera?.rear?.main || '-';
  const frontCam = raw.camera?.front?.main || '-';
  const camera = frontCam !== 'None' && frontCam !== '-'
    ? `${rearCam}+${frontCam}`
    : rearCam;

  return {
    id,
    brand,
    model,
    ram,
    storage,
    releaseYear,
    releaseMonth,
    price: priceCny,
    priceSource: 'official' as const,
    priceUpdated: new Date().toISOString().split('T')[0],
    screen,
    battery: batteryCapacity,
    processor,
    camera,
  };
}

/**
 * 获取所有手机数据（已转换为项目类型）
 */
export async function getAllPhones(): Promise<Phone[]> {
  const raw = await getAllRawPhones();
  return raw.map((r, i) => convertToPhone(r, i));
}

/**
 * 按关键词搜索手机（已转换为项目类型）
 */
export async function searchPhones(keyword: string): Promise<Phone[]> {
  const raw = await searchRawPhones(keyword);
  return raw.map((r, i) => convertToPhone(r, i));
}

/**
 * 清除缓存（用于测试或手动刷新）
 */
export function clearCache(): void {
  cache.clear();
}
