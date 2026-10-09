import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildSystem, chatRequestSchema } from "@/lib/chat";
import { ensureAnthropicEnv } from "@/lib/env";

/**
 * POST /api/chat — the Workbench's real inference call. The selected
 * Nscale model's name and the user's parameters shape the reply. The key
 * stays server-side: env var, .env.local, or the committed env.demo
 * fallback (see src/lib/env.ts).
 */
export async function POST(request: Request) {
  ensureAnthropicEnv();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error: "ANTHROPIC_API_KEY isn't set. Add it to .env.local or env.demo.",
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Send { modelId, modelName, developer, system, params, messages }.",
      },
      { status: 400 },
    );
  }

  const client = new Anthropic({
    defaultHeaders: process.env.ANTHROPIC_WORKSPACE_ID
      ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID }
      : undefined,
  });

  const req = parsed.data;
  try {
    const response = await client.beta.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-opus-5-5",
      max_tokens: Math.min(4000, Math.max(256, req.params.maxTokens)),
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: buildSystem(req),
      messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (response.stop_reason === "refusal" || !text) {
      return NextResponse.json(
        { error: "The model declined to answer that." },
        { status: 422 },
      );
    }
    return NextResponse.json({ result: { text }, model: response.model });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "The Anthropic API key was rejected. Check .env.local." },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited by the Anthropic API. Try again shortly." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error("chat: Anthropic API error", error.status, error.message);
      return NextResponse.json(
        { error: `Anthropic API error (${error.status}). Try again.` },
        { status: 502 },
      );
    }
    console.error("chat: unexpected error", error);
    return NextResponse.json(
      { error: "Couldn't reach the Anthropic API. Check your connection." },
      { status: 502 },
    );
  }
}
