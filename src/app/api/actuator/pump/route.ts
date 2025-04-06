import { NextRequest, NextResponse } from "next/server";
import { getMqttClient } from "@/app/api/lib/mqttClient";

let lastKnownPumpState: Record<string, "on" | "off"> = {};
const mqttClient = getMqttClient();

export async function POST(request: NextRequest) {
  const { command, device_id } = await request.json();

  if (!["on", "off"].includes(command) || !device_id) {
    return NextResponse.json({ error: "Invalid command or missing device_id" }, { status: 400 });
  }

  const topic = `esp32/${device_id}/pump`;
  mqttClient.publish(topic, command);
  lastKnownPumpState[device_id] = command;

  return NextResponse.json({ success: true, topic, command });
}

export async function GET(request: NextRequest) {
  const device_id = request.nextUrl.searchParams.get("device_id");
  if (!device_id) {
    return NextResponse.json({ error: "Missing device_id" }, { status: 400 });
  }

  return NextResponse.json({ state: lastKnownPumpState[device_id] ?? "off" });
}
