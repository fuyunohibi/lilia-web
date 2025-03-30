"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function emailLogin(data) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: "Could not authenticate user" };
  }

  revalidatePath("/", "layout");
}

export async function signup(data) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    console.error("Signup error (auth):", authError.message);
    return { error: "Signup failed. Please try again." };
  }

  const userId = authData.user?.id;
  if (!userId) {
    console.error("Signup error: User ID not found after signup.");
    return { error: "Signup failed. Please try again." };
  }

  const { error: profileError } = await supabase.from("users").insert({
    user_id: userId,
    username: data.username,
    full_name: data.full_name,
    join_date: new Date().toISOString(),
  });

  if (profileError) {
    console.error("Signup error (profile):", profileError.message);
    return { error: "Signup failed. Please try again." };
  }

  revalidatePath("/", "layout");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
