import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const jsonHeaders = {
    ...corsHeaders,
    "Content-Type": "application/json",
  };

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Use POST to send a message." }),
      { status: 405, headers: jsonHeaders },
    );
  }

  try {
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENROUTER_API_KEY is missing from Supabase Secrets.",
        }),
        { status: 500, headers: jsonHeaders },
      );
    }

    let body: { message?: unknown };

    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Request body must be valid JSON." }),
        { status: 400, headers: jsonHeaders },
      );
    }

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Please enter a message." }),
        { status: 400, headers: jsonHeaders },
      );
    }

    if (message.length > 4000) {
      return new Response(
        JSON.stringify({ error: "Message is too long. Maximum is 4000 characters." }),
        { status: 400, headers: jsonHeaders },
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content:
                "You are JARVIS, a helpful assistant for yoga teachers and studios. Help with scheduling, student enquiries, and follow-up drafts. Be friendly, concise, and practical. Do not claim to have accessed WhatsApp, student records, or calendars unless the application has actually supplied that information.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("OpenRouter request failed:", response.status, result);

      return new Response(
        JSON.stringify({
          error: "OpenRouter could not process your request.",
          status: response.status,
          details: result,
        }),
        { status: 502, headers: jsonHeaders },
      );
    }

    const answer = result.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      return new Response(
        JSON.stringify({ error: "The AI returned an empty response." }),
        { status: 502, headers: jsonHeaders },
      );
    }

    return new Response(
      JSON.stringify({
        answer: answer.trim(),
        modelUsed: result.model ?? "openrouter/free",
      }),
      { status: 200, headers: jsonHeaders },
    );
  } catch (error) {
    console.error("JARVIS function error:", error);

    return new Response(
      JSON.stringify({ error: "JARVIS could not answer right now. Please try again." }),
      { status: 500, headers: jsonHeaders },
    );
  }
});
