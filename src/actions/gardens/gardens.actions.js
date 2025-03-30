"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function addGarden(data) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("add_garden", {
    p_team_id: data.team_id,
    p_garden_name: data.garden_name,
    p_garden_location: data.garden_location,
    p_is_default: data.is_default,
  });

  if (error) {
    console.error("Error adding garden via RPC:", error.message);
    return { error: error.message };
  }

  revalidatePath("/gardens");
  return { success: true };
}

export async function getGardenPlants(gardenId) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_garden_plants", {
    p_garden_id: gardenId,
  });

  if (error) {
    console.error("Error fetching garden plants:", error.message);
    return { error: error.message };
  }

  return { data };
}