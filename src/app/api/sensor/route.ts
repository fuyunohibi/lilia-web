// app/api/sensor/route.ts
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';
import pool from '@/app/api/shared/db'; // This path must match the actual location

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        farm_id,
        temperature,
        humidity,
        soil_moisture1,
        soil_moisture2,
        light,
        liquid_detected,
        timestamp
      FROM sensor_data
      ORDER BY timestamp DESC
      LIMIT 1;
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No sensor data found' }, { status: 404 });
    }

    const data = result.rows[0];
    data.timestamp = DateTime.fromJSDate(data.timestamp).setZone('Asia/Bangkok').toISO();

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('❌ Sensor API error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch sensor data' }, { status: 500 });
  }
}
