export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    const errorMessage = JSON.stringify("Email and password are required");
    return redirect("/register?error=" + errorMessage);
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    const errorMessage = JSON.stringify(signUpError.message);
    return redirect("/register?error=" + errorMessage);
  }

  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError) {
    const errorMessage = JSON.stringify(loginError.message);
    return redirect("/signin?error=" + errorMessage);
  }

  const { access_token, refresh_token } = loginData.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });
  return redirect("/dashboard");
};
