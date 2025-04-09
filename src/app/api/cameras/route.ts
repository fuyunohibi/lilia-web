import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const gardenId = body.garden_id;

  if (!gardenId) {
    return NextResponse.json({ error: "Missing garden_id" }, { status: 400 });
  }

  const supabase = await createClient();

  // Step 1: Get camera info
  const { data: camera, error: cameraError } = await supabase
    .from("cameras")
    .select("*")
    .eq("garden_id", gardenId)
    .single();

  if (cameraError || !camera) {
    return NextResponse.json({ camera: null }, { status: 200 }); // No camera yet
  }

  // Step 2: Get device_id from gardens
  const { data: garden, error: gardenError } = await supabase
    .from("gardens")
    .select("device_id")
    .eq("garden_id", gardenId)
    .single();

  if (gardenError || !garden?.device_id) {
    return NextResponse.json({ error: "Garden device not found" }, { status: 500 });
  }

  // Step 3: Get device address
  const { data: device, error: deviceError } = await supabase
    .from("device_address")
    .select("device_address")
    .eq("device_id", garden.device_id)
    .single();

  if (deviceError || !device?.device_address) {
    return NextResponse.json({ error: "Device address not found" }, { status: 500 });
  }

  // ✅ Step 4: Build full stream URL with port and camera_ip
  const fullStreamUrl = `ws://${device.device_address}:5000`;


  console.log("🎥 Full Stream URL:", fullStreamUrl);


  return NextResponse.json({
    camera: {
      camera_ip: camera.camera_ip,
      port: camera.port,
      username: camera.username,
      password: camera.password,
      full_stream_url: fullStreamUrl,
      device_address: device.device_address, 
    },
  });
}
