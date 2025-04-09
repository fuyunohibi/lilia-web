import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const garden_id = searchParams.get('garden_id');

  if (!garden_id) {
    return NextResponse.json({ error: 'Missing garden_id' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('get_sensor_data_by_garden', {
    gid: garden_id,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch sensor data' }, { status: 500 });
  }

  return NextResponse.json({ data });
}
