import { NextRequest, NextResponse } from 'next/server';
import mqtt from 'mqtt';

let lastKnownState: Record<string, "on" | "off"> = {
  pump: "off",
  fan: "off",
};

const mqttClient = mqtt.connect('ws://100.84.67.85:9001');

mqttClient.on('connect', () => {
  console.log('📡 Connected to MQTT broker from API');
});

export async function POST(request: NextRequest, { params }: { params: { type: string } }) {
  const body = await request.json();
  const { command } = body;
  const type = params.type;

  if (!["pump", "fan"].includes(type) || !["on", "off"].includes(command)) {
    return NextResponse.json({ error: 'Invalid command or actuator type' }, { status: 400 });
  }

  mqttClient.publish(`esp32/${type}`, command);
  lastKnownState[type] = command;

  return NextResponse.json({ success: true, topic: `esp32/${type}`, command });
}

export async function GET(_: NextRequest, { params }: { params: { type: string } }) {
  const type = params.type;
  if (!["pump", "fan"].includes(type)) {
    return NextResponse.json({ error: 'Invalid actuator type' }, { status: 400 });
  }

  return NextResponse.json({ state: lastKnownState[type] });
}
