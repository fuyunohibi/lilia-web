// app/api/analyics/route.ts
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';
import pool from '@/app/api/shared/db'; // This path must match the actual location

export async function GET() {
  try {
    const result = await pool.query(`
        SELECT
          vpd,
          dli,
          soil_water_deficit_estimation,
          plant_heat_stress,
          timestamp
        FROM plant_health_metrics
        WHERE timestamp >= NOW() - INTERVAL '24 HOURS'
        ORDER BY timestamp ASC;
      `);
      
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No sensor data found' }, { status: 404 });
    }

    const data = result.rows.map((row) => ({
        ...row,
        timestamp: DateTime.fromJSDate(row.timestamp).setZone('Asia/Bangkok').toISO()
      }));
      
      return NextResponse.json({ data });
      
  } catch (err: any) {
    console.error('❌ Sensor API error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch sensor data' }, { status: 500 });
  }
}
