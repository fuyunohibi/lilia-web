"use server";

import { createClient } from "@/lib/supabase-client";

export async function addTeam(data) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("add_team", {
    p_team_name: data.team_name,
    p_members: data.members,
  });

  if (error) {
    console.error("Error adding team via RPC:", error.message);
    return { error: error.message };
  }
  return { success: true };
}

export async function getTeamDetails(teamId) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_team_details", {
    p_team_id: teamId,
  });
  if (error) {
    console.error("Error fetching team details:", error.message);
    return { error: error.message };
  }
  return { data };
}