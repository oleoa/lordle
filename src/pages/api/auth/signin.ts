export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    const errorMessage = JSON.stringify("Email and password are required");
    return redirect("/signin?error=" + errorMessage);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorMessage = JSON.stringify(error.message);
    return redirect("/signin?error=" + errorMessage);
  }

  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });
  return redirect("/dashboard");
};
