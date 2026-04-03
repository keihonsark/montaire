import { NextRequest, NextResponse } from 'next/server';

const VDB_TOKEN = 'iltz_Ie1tN0qm-ANqF7X6SRjwyhmMtzZsmqvyWOZ83I';
const VDB_API_KEY = '_eTAh9su9_0cnehpDpqM9xA';
const VDB_BASE_URL = 'https://apiservices.vdbapp.com/v2/diamonds';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = new URLSearchParams();
  params.set('type', searchParams.get('type') || 'Diamond');
  params.set('markup_mode', 'true');
  params.set('page_size', searchParams.get('page_size') || '20');
  params.set('page_number', searchParams.get('page_number') || '1');
  params.set('with_images', 'true');

  if (searchParams.get('shapes')) {
    searchParams.get('shapes')!.split(',').forEach(shape => {
      params.append('shapes[]', shape);
    });
  }
  if (searchParams.get('size_from')) params.set('size_from', searchParams.get('size_from')!);
  if (searchParams.get('size_to')) params.set('size_to', searchParams.get('size_to')!);
  if (searchParams.get('color_from')) params.set('color_from', searchParams.get('color_from')!);
  if (searchParams.get('color_to')) params.set('color_to', searchParams.get('color_to')!);
  if (searchParams.get('clarity_from')) params.set('clarity_from', searchParams.get('clarity_from')!);
  if (searchParams.get('clarity_to')) params.set('clarity_to', searchParams.get('clarity_to')!);
  if (searchParams.get('cut_from')) params.set('cut_from', searchParams.get('cut_from')!);
  if (searchParams.get('cut_to')) params.set('cut_to', searchParams.get('cut_to')!);
  if (searchParams.get('price_total_from')) {
    params.set('price_total_from', searchParams.get('price_total_from')!);
    params.set('total_or_price_per_carat', 'total_sales_price');
  }
  if (searchParams.get('price_total_to')) {
    params.set('price_total_to', searchParams.get('price_total_to')!);
    params.set('total_or_price_per_carat', 'total_sales_price');
  }
  if (searchParams.get('labs')) {
    searchParams.get('labs')!.split(',').forEach(lab => {
      params.append('labs[]', lab);
    });
  }
  if (searchParams.get('sort')) {
    params.append('preference[]', searchParams.get('sort')!);
  }

  try {
    const response = await fetch(`${VDB_BASE_URL}?${params.toString()}`, {
      headers: {
        'Authorization': `Token token=${VDB_TOKEN}, api_key=${VDB_API_KEY}`,
        'Cache-Control': 'no-cache',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch diamonds' }, { status: 500 });
  }
}
