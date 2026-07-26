import { NextResponse } from 'next/server';
import { parseFiltersFromParams } from '@/lib/utils/filter';
import { searchPhonesWithFilters } from '@/lib/services/phoneService';

/**
 * 手机对比 API
 * GET /api/compare?ram=16&brand=apple&keyword=iPhone+16
 *
 * 数据来源:
 * - 主数据源: GitHub API (AnarDevStudio/PhoneSpecsAPI) - 实时获取
 * - 降级数据源: 本地 fallback 数据
 *
 * 响应包含数据来源标识，便于前端展示
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parseFiltersFromParams(searchParams);

  try {
    const result = await searchPhonesWithFilters(filters);
    return NextResponse.json({
      count: result.total,
      results: result.phones,
      source: result.source,
      cached: result.cached,
      error: result.error,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { count: 0, results: [], source: 'fallback', error: message },
      { status: 500 },
    );
  }
}
