import { NextRequest, NextResponse } from 'next/server';
import mqtt from 'mqtt';

// Local state just for this route file
let lastKnownPumpState: "on" | "off" = "off";

// MQTT client setup
const mqttClient = mqtt.connect('ws://100.84.67.85:9001');

mqttClient.on('connect', () => {
  console.log('📡 Connected to MQTT broker (Pump)');
});

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
