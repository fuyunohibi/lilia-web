"use server";

import { createClient } from "@/utils/supabase/server";

export async function addSchedule({
  garden_id,
  day,
  time,
  triggered,
  active
}) {
  console.log("Calling addSchedule");

  const supabase = await createClient();
  const { error } = await supabase.rpc("add_schedule", {
    p_garden_id: garden_id,
    p_day: day,
    p_time: time,
    p_triggered: triggered,
    p_active: active,
  });
  
  console.log("RPC response error:", error);

  if (error) {
    throw new Error(`Error adding schedule via RPC: ${error.message}`);
  }
}

export const getSchedules = async (gardenId) => {
  console.log("Calling getSchedules with:", gardenId);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_garden_schedules", {
    p_garden_id: gardenId,
  });

  console.log("RPC data:", data);
  console.log("RPC error:", error);

  return { data, error };
};

export const removeSchedule = async (id) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("remove_schedule", {
    p_id: id,
  });

  if (error) {
    throw new Error(`Error removing schedule via RPC: ${error.message}`);
  }
};
export const updateSchedule = async (id, day, time) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_schedule", {
    p_id: id,
    p_day: day,
    p_time: time,
  });

  if (error) {
    throw new Error(`Error updating schedule via RPC: ${error.message}`);
  }
}

export const updateScheduleTriggered = async (id, triggered) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_schedule_triggered", {
    p_id: id,
    p_triggered: triggered,
  });

  if (error) {
    throw new Error(`Error updating schedule via RPC: ${error.message}`);
  }
}

export const updateScheduleActive = async (id, active) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_schedule_active", {
    p_id: id,
    p_active: active,
  });

  if (error) {
    throw new Error(`Error updating schedule via RPC: ${error.message}`);
  }
}
