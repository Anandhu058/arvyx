const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Method not allowed. Use POST." },
      405,
    );
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return jsonResponse(
        { error: "GEMINI_API_KEY is missing from Supabase Secrets." },
        500,
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        { error: "Invalid JSON request body." },
        400,
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("prompt" in body) ||
      typeof body.prompt !== "string"
    ) {
      return jsonResponse(
        { error: 'Send a JSON body with a "prompt" string.' },
        400,
      );
    }

    const prompt = body.prompt.trim();

    if (!prompt) {
      return jsonResponse(
        { error: "Please enter a prompt." },
        400,
      );
    }

    if (prompt.length > 10000) {
      return jsonResponse(
        { error: "Prompt must be 10,000 characters or fewer." },
        400,
      );
    }

    const systemPrompt =
      "You are JARVIS, an AI assistant for yoga teachers and studios. " +
      "Help with student enquiries, lead qualification, follow-up drafts, " +
      "class scheduling, and studio operations. Be friendly, concise, " +
      "and practical. Never claim to have accessed WhatsApp, student " +
      "records, or calendars unless that information was supplied.";

    // Discover models supported by this API key.
    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
    );

    const modelsData = await modelsResponse.json();

    if (!modelsResponse.ok) {
      console.error(
        "Gemini model discovery failed:",
        modelsResponse.status,
        modelsData.error?.message ?? "Unknown API error",
      );

      return jsonResponse(
        {
          error: "Could not retrieve Gemini models.",
          status: modelsResponse.status,
          details:
            modelsData.error?.message ??
            "Check your Gemini API key and project configuration.",
        },
        502,
      );
    }

    const models = Array.isArray(modelsData.models)
      ? modelsData.models
      : [];

    const supportedModels = models
      .filter((model: {
        name?: string;
        supportedGenerationMethods?: string[];
      }) =>
        typeof model.name === "string" &&
        model.supportedGenerationMethods?.includes("generateContent") &&
        /flash/i.test(model.name) &&
        !/vision|audio|tts|image|robotics/i.test(model.name)
      )
      .sort((a: { name: string }, b: { name: string }) => {
        // Prefer stable model names over preview/experimental versions.
        const aPreview = /preview|experimental|exp-/i.test(a.name) ? 1 : 0;
        const bPreview = /preview|experimental|exp-/i.test(b.name) ? 1 : 0;
        return aPreview - bPreview;
      });

    if (supportedModels.length === 0) {
      return jsonResponse(
        {
          error: "No supported Gemini Flash model was found for this API key.",
          details:
            "Check the models available to your Google AI Studio project.",
        },
        502,
      );
    }

    let lastStatus = 502;
    let lastError = "No Gemini model could complete the request.";

    // Try supported Flash models until one succeeds.
    for (const model of supportedModels.slice(0, 3)) {
      const modelName = model.name as string;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        const text = result.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text ?? "")
          .join("")
          .trim();

        if (text) {
          return jsonResponse({
            text,
            modelUsed: modelName,
          });
        }

        lastStatus = 502;
        lastError =
          "Gemini responded but did not return text. The response may have been blocked.";
        continue;
      }

      lastStatus = response.status;
      lastError =
        result.error?.message ?? "Gemini returned an unknown error.";

      console.error(
        "Gemini model request failed:",
        modelName,
        response.status,
        lastError,
      );

      // Retry another model for availability, quota, or model-specific errors.
      if (![400, 403, 404, 429, 500, 502, 503, 504].includes(response.status)) {
        break;
      }
    }

    return jsonResponse(
      {
        error: "Gemini could not generate a response.",
        status: lastStatus,
        details: lastError,
      },
      502,
    );
  } catch (error) {
    console.error(
      "JARVIS error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return jsonResponse(
      { error: "JARVIS could not answer right now. Please try again." },
      500,
    );
  }
});
