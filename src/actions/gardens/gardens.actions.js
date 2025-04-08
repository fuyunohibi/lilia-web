"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function addGarden(data) {
  const supabase = await createClient();

  console.log(data);

  const { error } = await supabase.rpc("add_garden", {
    p_team_id: data.team_id,
    p_garden_name: data.garden_name,
    p_garden_location: data.garden_location,
    p_device_id: data.device_id,
    p_is_default: data.is_default,
  });

  if (error) {
    console.error("Error adding garden via RPC:", error.message);
    return { error: error.message };
  }

  revalidatePath("/gardens");
  return { success: true };
}

export async function getDefaultGarden(teamId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gardens")
    .select("*")
    .eq("team_id", teamId)
    .eq("is_default", true)
    .single();

  if (error) throw error;
  return { data };
}

export async function setDefaultGarden(gardenId) {
  const supabase = await createClient();

  const { data: garden, error: gardenError } = await supabase
    .from("gardens")
    .select("team_id")
    .eq("garden_id", gardenId)
    .single();

  if (gardenError || !garden)
    throw gardenError ?? new Error("Garden not found");

  const teamId = garden.team_id;

  const { error } = await supabase.rpc("set_default_garden_transaction", {
    input_garden_id: gardenId,
    input_team_id: teamId,
  });

  if (error) throw error;
}

export async function updateGarden({
  garden_id,
  team_id,
  garden_name,
  garden_location,
  device_id,
  is_default,
}) {
  const supabase = await createClient();

  const safeDeviceId = device_id && device_id.trim() !== "" ? device_id : null;

  const { error } = await supabase.rpc("update_garden", {
    p_garden_id: garden_id,
    p_team_id: team_id,
    p_garden_name: garden_name,
    p_garden_location: garden_location,
    p_device_id: safeDeviceId, 
    p_is_default: is_default,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
