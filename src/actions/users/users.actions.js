"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCurrentUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data?.user?.id) {
    if (error && !error.message.includes("Auth session missing")) {
      console.error("Error retrieving user:", error.message);
    }
    return null;
  }
  return data.user.id;
}

export async function getCurrentUserUsername() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.warn(
      "No authenticated user found:",
      authError?.message || "User not logged in."
    );
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching current user's username:", error.message);
    return null;
  }

  return data?.username || null;
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.warn(
      "No authenticated user found:",
      authError?.message || "User not logged in."
    );
    return null; 
  }

  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle(); 

  if (profileError) {
    console.error("Error fetching user profile:", profileError.message);
    return null;
  }

  if (!userProfile) {
    console.warn("User profile not found for authenticated user:", user.id);
    return null;
  }

  return userProfile;
}


export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_all_users");
  if (error) {
    console.error("Error fetching users:", error);
    return { error: error.message };
  }
  return { data };
}