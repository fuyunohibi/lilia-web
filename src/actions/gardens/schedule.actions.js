"use server";

import { createClient } from "@/utils/supabase/server";

export async function addSchedule(
  garden_id,
  day,
  time,
  triggered,
  active,
  duration,
  min_moisture
) {
  console.log("Calling addSchedule");

  const supabase = await createClient();

  const { data, error: error_get } = await getSchedules(garden_id);
  console.log("getSchedules data:", data);
  console.log("getSchedules error:", error_get);
  if (error_get) {
    throw new Error(`Error getting schedules: ${error_get.message}`);
  }
  if (!data) {
    throw new Error("No schedules found from addSchedules");
  }

  // Check for conflicts
  const conflict = checkScheduleConflict(data, day, time);
  if (conflict) {
    console.log("Conflict found:", conflict);
    throw new Error("Schedule conflict detected");
  }

  const { error } = await supabase.rpc("add_schedule", {
    p_garden_id: garden_id,
    p_day: day,
    p_time: time,
    p_triggered: triggered,
    p_active: active,
    p_duration: duration,
    p_min_moisture: min_moisture,
  });

  console.log("RPC response error:", error);

  if (error) {
    throw new Error(`Error adding schedule via RPC: ${error.message}`);
  }

  return { success: true };
}


const checkScheduleConflict = (data, day, time) => {
  return Object.values(data).find((schedule) => {
    return schedule.day === day && schedule.time === time;
  });
};


export const getSchedules = async (gardenId) => {
  console.log("Calling getSchedules with:", gardenId);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_garden_schedules", {
    p_garden_id: gardenId,
  });

  console.log("RPC data from getSchedule:", data);

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

  return { success: true };
};

export async function updateSchedule(
  id,
  day,
  time,
  triggered,
  active,
  duration,
  min_moisture,
  gardenId
) {
  const supabase = await createClient();


  const { data: existing, error: fetchError } = await supabase
    .from("schedules")
    .select("day, time, duration")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch existing schedule: ${fetchError.message}`);
  }

  const shouldResetTriggered =
    existing.day !== day || existing.time !== time || existing.duration !== duration;

  const { error } = await supabase.rpc("update_schedule", {
    p_id: id,
    p_day: day,
    p_time: time,
    p_triggered: shouldResetTriggered ? false : triggered,
    p_active: active,
    p_duration: duration,
    p_min_moisture: min_moisture,
  });

  if (error) {
    throw new Error(`Error updating schedule via RPC: ${error.message}`);
  }

  return { success: true };
}

