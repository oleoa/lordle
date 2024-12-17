export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async () => {
  let { data, error } = await supabase.from("personal-records").select("*");
  if (error) return new Response(JSON.stringify(error), { status: 500 });
  else return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return new Response(JSON.stringify("Player is logged out"), {
        status: 200,
      });

    const body = await request.json();
    const time = body.time;
    const rows = body.rows;
    const letters = body.letters;
    const answer = body.answer;

    const { data, error } = await supabase
      .from("personal-records")
      .insert([
        {
          time: time,
          rows: rows,
          letters: letters,
          answer: answer,
          attempts: null,
          user_id: user.id,
        },
      ])
      .select();

    if (error) return new Response(JSON.stringify(error), { status: 500 });
    else return new Response(JSON.stringify(data), { status: 200 });
  }
  return new Response(null, { status: 400 });
};
