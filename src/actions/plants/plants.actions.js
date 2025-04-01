"use server";

import { createClient } from "@/utils/supabase/server";

export async function addPlant(data) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("add_plant", {
    p_garden_id: data.garden_id,
    p_plant_name: data.plant_name,
    p_description: data.description ?? null,
    p_watering_days: data.watering_days,
    p_watering_time: data.watering_time,
    p_plant_image_url: data.image_url ?? null,
  });

  if (error) {
    console.error("Error adding plant via RPC:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

// plants.actions.ts
export async function getPlants(gardenId) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_garden_plants", {
    p_garden_id: gardenId,
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
