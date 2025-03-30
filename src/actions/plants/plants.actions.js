"use server";

import { createClient } from "@/utils/supabase/server";

export async function addPlant(data) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("add_plant", {
    p_garden_id: data.garden_id,
    p_plant_name: data.plant_name,
    p_description: data.description,
    p_sunlight_requirement: data.sunlight_requirement,
    p_watering_requirement: data.watering_requirement,
    p_image_url: data.image_url,
  });

  if (error) {
    console.error("Error adding plant via RPC:", error.message);
    return { error: error.message };
  }
  return { success: true };
}
