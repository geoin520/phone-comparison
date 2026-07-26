import { Phone, FilterOptions } from '@/types';

/**
 * 筛选逻辑
 * - 只对 FilterOptions 中存在（非 undefined）的字段进行比对
 * - 某字段不存在则跳过该维度筛选（相当于全选）
 * - 结果按 price 从低到高排序
 */
export function filterPhones(phones: Phone[], filters: FilterOptions): Phone[] {
  const filtered = phones.filter((phone) => {
    if (filters.ram !== undefined && phone.ram !== filters.ram) return false;
    if (filters.storage !== undefined && phone.storage !== filters.storage) return false;
    if (filters.brand !== undefined && phone.brand !== filters.brand) return false;
    if (filters.releaseYear !== undefined && phone.releaseYear !== filters.releaseYear)
      return false;
    if (filters.priceRange !== undefined) {
      const [minStr, maxStr] = filters.priceRange.split('-');
      const min = Number(minStr);
      const max = Number(maxStr);
      if (!Number.isNaN(min) && phone.price < min) return false;
      if (!Number.isNaN(max) && phone.price >= max) return false;
    }
    if (filters.keyword !== undefined && filters.keyword.trim() !== '') {
      const kw = filters.keyword.trim().toLowerCase();
      const hay = `${phone.brand} ${phone.model}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    return true;
  });

  return filtered.sort((a, b) => a.price - b.price);
}

/**
 * 从 FilterOptions 构建 URL Query String
 */
export function buildQueryString(filters: FilterOptions): string {
  const params = new URLSearchParams();
  if (filters.ram !== undefined) params.set('ram', String(filters.ram));
  if (filters.storage !== undefined) params.set('storage', String(filters.storage));
  if (filters.brand !== undefined) params.set('brand', filters.brand);
  if (filters.releaseYear !== undefined) params.set('releaseYear', String(filters.releaseYear));
  if (filters.priceRange !== undefined) params.set('priceRange', filters.priceRange);
  if (filters.keyword !== undefined && filters.keyword.trim() !== '') {
    params.set('keyword', filters.keyword.trim());
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/**
 * 从 URLSearchParams 解析出 FilterOptions
 */
export function parseFiltersFromParams(
  searchParams: URLSearchParams,
): FilterOptions {
  const filters: FilterOptions = {};

  const ram = searchParams.get('ram');
  if (ram !== null && ram !== '') filters.ram = Number(ram);

  const storage = searchParams.get('storage');
  if (storage !== null && storage !== '') filters.storage = Number(storage);

  const brand = searchParams.get('brand');
  if (brand !== null && brand !== '') filters.brand = brand as FilterOptions['brand'];

  const releaseYear = searchParams.get('releaseYear');
  if (releaseYear !== null && releaseYear !== '') filters.releaseYear = Number(releaseYear);

  const priceRange = searchParams.get('priceRange');
  if (priceRange !== null && priceRange !== '') filters.priceRange = priceRange;

  const keyword = searchParams.get('keyword');
  if (keyword !== null && keyword !== '') filters.keyword = keyword;

  return filters;
}
