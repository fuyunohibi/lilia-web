import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { garden_id, camera_ip, port, username, password } = await req.json();

  if (!garden_id || !camera_ip || !port) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase.from("cameras").insert({
    garden_id,
    camera_ip,
    port,
    username,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
