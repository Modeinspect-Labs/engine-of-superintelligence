"use client";

import type { ChatRequest, ChatResponse } from "./chat";
import { scriptedReply } from "./chat";

/** Calls the chat route; falls back to the local script when it fails. */
export async function askModel(
  req: ChatRequest,
): Promise<{ text: string; scripted: boolean }> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });
    const json = (await res.json()) as {
      result?: ChatResponse;
      error?: string;
    };
    if (res.ok && json.result?.text)
      return { text: json.result.text, scripted: false };
  } catch {
    /* fall through to the script */
  }
  const last = [...req.messages].reverse().find((m) => m.role === "user");
  return {
    text: scriptedReply(last?.content ?? "", req.modelName),
    scripted: true,
  };
}
