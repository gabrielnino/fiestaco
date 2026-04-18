import { NextRequest, NextResponse } from 'next/server';
import { getPrices, savePrices, PricesConfig } from '../../../../lib/config-store';

const ADMIN_TOKEN = 'Bearer fiestaco-admin-2024';

export async function GET(_request: NextRequest) {
  try {
    const prices = getPrices();
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unparsedBody = await request.text();
    let parsedBody: Partial<PricesConfig> = {};
    if (unparsedBody) {
      parsedBody = JSON.parse(unparsedBody);
    }
    
    // Validate we're sending something sensible
    if (!parsedBody || typeof parsedBody !== 'object') {
       return NextResponse.json({ error: 'Invalid config format' }, { status: 400 });
    }

    const updated = savePrices(parsedBody);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
