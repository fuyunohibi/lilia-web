"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

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

  revalidatePath("/");
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

export async function getCurrentUserTeams(userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("team_id, team_name, members")
    .contains("members", [userId]);
  if (error) {
    console.error("Error fetching teams:", error.message);
    return { error: error.message };
  }
  return { data };
}

export async function getTeamMembers(teamId) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_team_members", {
    p_team_id: teamId,
  });

  if (error) {
    console.error("Error fetching team members:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function getTeamGardens(teamId) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_team_gardens", {
    p_team_id: teamId,
  });

  if (error) {
    console.error("Error fetching team gardens:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function updateTeam({ teamId, teamName, members }) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("update_team", {
    p_team_id: teamId,
    p_team_name: teamName,
    p_members: members,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function removeTeamMember({
  teamId,
  memberId,
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("remove_team_member", {
    p_team_id: teamId,
    p_member_id: memberId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
