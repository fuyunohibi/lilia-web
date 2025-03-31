"use server";

import { createClient } from "@/utils/supabase/server";

export async function addSensor({
  garden_id,
  sensor_name,
  sensor_type,
  unit,
}: {
  garden_id: string;
  sensor_name: string;
  sensor_type: string;
  unit: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("add_sensor", {
    p_garden_id: garden_id,
    p_sensor_name: sensor_name,
    p_sensor_type: sensor_type,
    p_unit: unit,
  });

  if (error) {
    throw new Error(`Error adding sensor via RPC: ${error.message}`);
  }
}

export async function getGardenSensors(garden_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_garden_sensors", {
    p_garden_id: garden_id,
  });

  if (error) {
    throw new Error(`Error fetching garden sensors: ${error.message}`);
  }

  return data;
}
