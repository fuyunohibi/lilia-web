import { NextRequest, NextResponse } from 'next/server';
import { getMqttClient } from '@/app/api/lib/mqttClient';

let lastKnownPumpState: "on" | "off" = "off";
const mqttClient = getMqttClient();

export async function POST(request: NextRequest) {
  const { command } = await request.json();

  if (!["on", "off"].includes(command)) {
    return NextResponse.json({ error: 'Invalid command' }, { status: 400 });
  }

  mqttClient.publish("esp32/pump", command);
  lastKnownPumpState = command;

  return NextResponse.json({ success: true, topic: "esp32/pump", command });
}

export async function GET() {
  return NextResponse.json({ state: lastKnownPumpState });
}
