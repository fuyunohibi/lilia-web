"use server";

import { createClient } from "src/utils/supabase/server";

export async function addGarden(data) {
  const supabase = createClient();

  const { error } = await supabase.rpc("add_garden", {
    p_user_id: data.user_id || null,
    p_team_id: data.team_id || null,
    p_garden_name: data.garden_name,
    p_garden_location: data.garden_location,
  });

  if (error) {
    console.error("Error adding garden via RPC:", error.message);
    return { error: error.message };
  }
  return { success: true };
}
