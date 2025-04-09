// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const garden_id = searchParams.get('garden_id');

//   if (!garden_id) {
//     return NextResponse.json({ error: 'Missing garden_id' }, { status: 400 });
//   }

//   const { data, error } = await supabase.rpc('get_sensor_data_by_garden', {
//     gid: garden_id,
//   });

//     if (error) {
//       console.error("❌ Supabase query error:", error.message);
//       return NextResponse.json({ error: "Supabase error" }, { status: 500 });
//     }

//     if (!garden || !garden.device_id) {
//       console.warn("⚠️ No device_id found for garden:", gardenId);
//       return NextResponse.json({ error: "Device ID not found" }, { status: 404 });
//     }

//     const deviceId = garden.device_id;
//     // console.log("✅ Resolved Device ID:", deviceId);

//     const result = await pool.query(
//       `
//       SELECT
//         device_id,
//         temperature,
//         humidity,
//         soil_moisture1,
//         soil_moisture2,
//         light,
//         liquid_detected,
//         timestamp
//       FROM sensor_data
//       WHERE device_id = $1
//       ORDER BY timestamp DESC
//       LIMIT 1;
//     `,
//       [deviceId]
//     );

//     if (result.rows.length === 0) {
//       return NextResponse.json({ error: 'No sensor data found' }, { status: 404 });
//     }

//     const data = result.rows[0];
//     data.timestamp = DateTime.fromJSDate(data.timestamp).setZone('Asia/Bangkok').toISO();

//     return NextResponse.json({ data });

//   } catch (err: any) {
//     console.error('❌ API error:', err.message);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
