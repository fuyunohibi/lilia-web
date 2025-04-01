import { NextRequest, NextResponse } from 'next/server';
import mqtt from 'mqtt';

let lastKnownFanState: "on" | "off" = "off";

const mqttClient = mqtt.connect('ws://100.84.67.85:9001');

mqttClient.on('connect', () => {
  console.log('📡 Connected to MQTT broker (Fan)');
});

export async function POST(request: NextRequest) {
  const { command } = await request.json();

  if (!["on", "off"].includes(command)) {
    return NextResponse.json({ error: 'Invalid command' }, { status: 400 });
  }

  mqttClient.publish("esp32/fan", command);
  lastKnownFanState = command;

  return NextResponse.json({ success: true, topic: "esp32/fan", command });
}

export async function GET() {
  return NextResponse.json({ state: lastKnownFanState });
}
