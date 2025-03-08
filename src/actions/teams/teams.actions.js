"use server";

import { createClient } from "src/utils/supabase/server";

export async function addTeam(data) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("add_team", {
    p_team_name: data.teamName,
    p_members: data.members,
  });

  if (error) {
    console.error("Error adding team via RPC:", error.message);
    return { error: error.message };
  }
  return { success: true };
}