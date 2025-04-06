// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';
import pool from '@/app/api/shared/db';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gardenId = searchParams.get("garden_id");

  console.log("📥 Received garden_id:", gardenId);

  if (!gardenId) {
    return NextResponse.json({ error: "Missing garden_id" }, { status: 400 });
  }

  // Step 1: Get device_id from gardens table in Supabase
  const { data: garden, error } = await supabase
    .from("gardens")
    .select("device_id")
    .eq("garden_id", gardenId)
    .maybeSingle();

  if (error || !garden?.device_id) {
    console.error("❌ Failed to get device_id for garden:", gardenId);
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  const deviceId = garden.device_id;
  console.log("✅ Found device_id:", deviceId);

  // Step 2: Query metrics for that device
  try {
    const result = await pool.query(
      `
      SELECT
        date_trunc('hour', timestamp) AS hour,
        AVG(vpd) AS vpd,
        AVG(dli) AS dli,
        AVG(soil_water_deficit_estimation) AS soil_water_deficit_estimation,
        AVG(plant_heat_stress) AS plant_heat_stress
      FROM plant_health_metrics
      WHERE device_id = $1
        AND timestamp >= NOW() - INTERVAL '24 HOURS'
      GROUP BY hour
      ORDER BY hour ASC;
    `,
      [deviceId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No analytics data found" }, { status: 404 });
    }

    const data = result.rows.map((row) => ({
      ...row,
      timestamp: DateTime.fromJSDate(row.hour).setZone('Asia/Bangkok').toISO(),
    }));

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("❌ DB error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
