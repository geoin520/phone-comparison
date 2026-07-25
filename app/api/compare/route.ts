import { NextResponse } from 'next/server';
import { phones } from '@/lib/data/phones';
import { filterPhones, parseFiltersFromParams } from '@/lib/utils/filter';

// 可选 API 路由：GET /api/compare?ram=16&brand=apple
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parseFiltersFromParams(searchParams);
  const results = filterPhones(phones, filters);
  return NextResponse.json({ count: results.length, results });
}
