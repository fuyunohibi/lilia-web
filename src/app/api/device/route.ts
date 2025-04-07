import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gardenId = searchParams.get("garden_id");

  if (!gardenId) {
    return NextResponse.json({ error: "Missing garden_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("gardens")
    .select("device_id")
    .eq("garden_id", gardenId)
    .maybeSingle();

  if (error || !data?.device_id) {
    return NextResponse.json({ error: "Device ID not found" }, { status: 404 });
  }

  return NextResponse.json({ device_id: data.device_id });
}
