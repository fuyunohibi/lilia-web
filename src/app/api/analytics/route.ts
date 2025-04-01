// app/api/analyics/route.ts
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';
import pool from '@/app/api/shared/db'; // This path must match the actual location

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT
              date_trunc('hour', timestamp) AS hour,
              AVG(vpd) AS vpd,
              AVG(dli) AS dli,
              AVG(soil_water_deficit_estimation) AS soil_water_deficit_estimation,
              AVG(plant_heat_stress) AS plant_heat_stress
            FROM plant_health_metrics
            WHERE timestamp >= NOW() - INTERVAL '24 HOURS'
            GROUP BY hour
            ORDER BY hour ASC;
          `);
          

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'No sensor data found' }, { status: 404 });
        }

        const data = result.rows.map((row) => ({
            ...row,
            timestamp: DateTime.fromJSDate(row.hour).setZone('Asia/Bangkok').toISO(),
          }));

        return NextResponse.json({ data });

    } catch (err: any) {
        console.error('❌ Sensor API error:', err.message);
        return NextResponse.json({ error: 'Failed to fetch sensor data' }, { status: 500 });
    }
}
