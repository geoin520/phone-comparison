/**
 * 手机数据服务层
 *
 * 架构设计:
 * 1. 优先从 GitHub API (AnarDevStudio/PhoneSpecsAPI) 获取实时手机规格数据
 * 2. 网络请求失败时降级到本地 fallback 数据
 * 3. 支持按关键词搜索和按筛选条件过滤
 * 4. 内置内存缓存，减少重复请求
 *
 * 数据流:
 *   用户筛选条件 -> 服务层 -> [GitHub API (主)] -> [本地 fallback (降级)] -> 过滤 -> 返回
 */

import type { Phone, FilterOptions } from '@/types';
import { filterPhones } from '@/lib/utils/filter';
import { getAllPhones, searchPhones as ghSearchPhones } from '@/lib/data/githubSource';
import { phones as fallbackPhones } from '@/lib/data/phones';

/** 请求结果类型 */
export interface PhoneSearchResult {
  phones: Phone[];
  source: 'github' | 'fallback';
  total: number;
  cached: boolean;
  error?: string;
}

/** 全量数据缓存 */
let allPhonesCache: { data: Phone[]; fetchedAt: number; source: 'github' | 'fallback' } | null = null;
const ALL_CACHE_TTL = 10 * 60 * 1000; // 10 分钟

/**
 * 获取全量手机数据（优先 GitHub，降级本地）
 * 注意：GitHub 数据会与本地 fallback 数据合并，确保包含最新机型（如 iPhone 16e）
 */
export async function fetchAllPhones(): Promise<{
  phones: Phone[];
  source: 'github' | 'fallback';
  error?: string;
}> {
  // 检查缓存
  if (allPhonesCache && Date.now() - allPhonesCache.fetchedAt < ALL_CACHE_TTL) {
    return { phones: allPhonesCache.data, source: allPhonesCache.source };
  }

  // 尝试从 GitHub 获取
  try {
    const ghPhones = await getAllPhones();
    if (ghPhones.length > 0) {
      // 合并 GitHub 数据和本地 fallback 数据
      // 本地 fallback 数据包含 GitHub 数据库中可能缺失的最新机型（如 iPhone 16e）
      // 使用 model 字段去重，本地数据优先（因为价格为中国市场参考价）
      const localModels = new Set(fallbackPhones.map((p) => p.model.toLowerCase()));
      const ghOnly = ghPhones.filter(
        (p) => !localModels.has(p.model.toLowerCase()),
      );
      const merged = [...fallbackPhones, ...ghOnly];

      allPhonesCache = {
        data: merged,
        fetchedAt: Date.now(),
        source: 'github',
      };
      return { phones: merged, source: 'github' };
    }
    // GitHub 返回空数据，也降级
    throw new Error('GitHub data source returned empty');
  } catch (err) {
    // 降级到本地数据
    const error = err instanceof Error ? err.message : String(err);
    allPhonesCache = {
      data: fallbackPhones,
      fetchedAt: Date.now(),
      source: 'fallback',
    };
    return { phones: fallbackPhones, source: 'fallback', error };
  }
}

/**
 * 按关键词搜索手机（优先使用 GitHub 搜索，降级本地过滤）
 */
export async function searchPhonesByKeyword(keyword: string): Promise<PhoneSearchResult> {
  const kw = keyword.trim();
  if (!kw) {
    const { phones, source, error } = await fetchAllPhones();
    return { phones, source, total: phones.length, cached: !!allPhonesCache, error };
  }

  // 尝试 GitHub 搜索
  try {
    const ghResults = await ghSearchPhones(kw);

    // 同时在本地 fallback 数据中搜索（确保包含 GitHub 数据库中缺失的新机型）
    const localMatches = fallbackPhones.filter((p) => {
      const hay = `${p.brand} ${p.model}`.toLowerCase();
      return hay.includes(kw.toLowerCase());
    });

    if (ghResults.length > 0) {
      // 合并 GitHub 结果和本地匹配结果，按 model 去重，本地优先
      const localModels = new Set(localMatches.map((p) => p.model.toLowerCase()));
      const ghOnly = ghResults.filter(
        (p) => !localModels.has(p.model.toLowerCase()),
      );
      const merged = [...localMatches, ...ghOnly];
      return {
        phones: merged,
        source: 'github',
        total: merged.length,
        cached: false,
      };
    }

    // GitHub 搜索无结果，使用本地匹配结果
    if (localMatches.length > 0) {
      return {
        phones: localMatches,
        source: 'github',
        total: localMatches.length,
        cached: false,
      };
    }

    // 都无结果，尝试在全量数据中过滤
    const { phones, source } = await fetchAllPhones();
    const filtered = phones.filter((p) => {
      const hay = `${p.brand} ${p.model}`.toLowerCase();
      return hay.includes(kw.toLowerCase());
    });
    return {
      phones: filtered,
      source,
      total: filtered.length,
      cached: !!allPhonesCache,
    };
  } catch (err) {
    // 降级：在本地数据中搜索
    const error = err instanceof Error ? err.message : String(err);
    const filtered = fallbackPhones.filter((p) => {
      const hay = `${p.brand} ${p.model}`.toLowerCase();
      return hay.includes(kw.toLowerCase());
    });
    return {
      phones: filtered,
      source: 'fallback',
      total: filtered.length,
      cached: false,
      error,
    };
  }
}

/**
 * 按筛选条件搜索手机
 * - 如果有 keyword，优先走关键词搜索路径
 * - 否则获取全量数据后过滤
 */
export async function searchPhonesWithFilters(
  filters: FilterOptions,
): Promise<PhoneSearchResult> {
  // 有关键词：先按关键词搜索，再应用其他筛选条件
  if (filters.keyword && filters.keyword.trim() !== '') {
    const keywordResult = await searchPhonesByKeyword(filters.keyword);
    // 在关键词搜索结果上应用其他筛选条件（排除 keyword 本身）
    const otherFilters: FilterOptions = { ...filters };
    delete otherFilters.keyword;
    const filtered = filterPhones(keywordResult.phones, otherFilters);
    return {
      phones: filtered,
      source: keywordResult.source,
      total: filtered.length,
      cached: keywordResult.cached,
      error: keywordResult.error,
    };
  }

  // 无关键词：获取全量数据后过滤
  const { phones, source, error } = await fetchAllPhones();
  const filtered = filterPhones(phones, filters);
  return {
    phones: filtered,
    source,
    total: filtered.length,
    cached: !!allPhonesCache,
    error,
  };
}

/**
 * 清除缓存
 */
export function clearServiceCache(): void {
  allPhonesCache = null;
}
