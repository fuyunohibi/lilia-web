// import { NextRequest, NextResponse } from 'next/server';
// import { getMqttClient } from '@/app/api/lib/mqttClient';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// const mqttClient = getMqttClient();

// export async function POST(request: NextRequest) {
//   try {
//     const { command, garden_id } = await request.json();

//     if (!['on', 'off'].includes(command) || !garden_id) {
//       return NextResponse.json(
//         { error: 'Invalid command or missing garden_id' },
//         { status: 400 }
//       );
//     }

//     const { data: garden, error } = await supabase
//       .from('gardens')
//       .select('device_id')
//       .eq('garden_id', garden_id)
//       .maybeSingle();

//     if (error || !garden?.device_id) {
//       return NextResponse.json({ error: 'Device ID not found' }, { status: 404 });
//     }

//     const deviceId = garden.device_id;
//     const topic = `esp32/${deviceId}/fan`;

//     mqttClient.publish(topic, command);

//     // ✅ Persist state to Supabase
//     await supabase.from('actuator_states').upsert({
//       device_id: deviceId,
//       type: 'fan',
//       state: command,
//       updated_at: new Date().toISOString(),
//     });

//     return NextResponse.json({ success: true, topic, command });
//   } catch (err: any) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const deviceId = searchParams.get('device_id');

//   if (!deviceId) {
//     return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });
//   }

//   const { data, error } = await supabase
//     .from('actuator_states')
//     .select('state')
//     .eq('device_id', deviceId)
//     .eq('type', 'fan')
//     .maybeSingle();

//   if (error) {
//     return NextResponse.json({ error: 'Failed to fetch state' }, { status: 500 });
//   }

//   return NextResponse.json({ state: data?.state ?? 'off' });
// }

import { NextRequest, NextResponse } from 'next/server';
import { GET_actuator, POST_actuator } from '../route';

export async function POST(request: NextRequest) {
  return POST_actuator(request, 'fan');
}

export async function GET(request: NextRequest) {
  return GET_actuator(request, 'fan');
}
