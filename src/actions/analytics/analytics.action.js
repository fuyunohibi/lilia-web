"use server";

import { createClient } from "@/utils/supabase/server";

export const getGardenAnalytics = async (gardenId) => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_garden_analytics", {
      p_garden_id: gardenId,
    });
  
    if (error) {
      console.error("❌ Error fetching garden analytics:", error.message);
      return { data: [], error };
    }
  
    return { data, error: null };
  };
  