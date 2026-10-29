import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/assistantPrompt";
import { profile } from "@/data/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.CHAT_MODEL ?? "claude-opus-5-5";
const MAX_TURNS = 20;
const MAX_CHARS = 1500;

// Best-effort per-instance rate limit: 20 requests per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

function parseMessages(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) {
    return null;
  }
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_TURNS);
  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) messages.push({ role, content: text });
  }
  // The conversation must start and end with the visitor.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "You're asking a lot of questions! Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let messages: Anthropic.Beta.BetaMessageParam[] | null = null;
  try {
    messages = parseMessages(await req.json());
  } catch {
    // fall through to the 400 below
  }
  if (!messages) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  let client: Anthropic;
  try {
    // Resolves ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, or an `ant auth login` profile.
    client = new Anthropic();
  } catch {
    return Response.json({ error: "The assistant isn't configured yet." }, { status: 503 });
  }

  const stream = client.beta.messages.stream({
    model: MODEL,
    // A deliberately small cap: this is a public endpoint and answers are short.
    max_tokens: 4000,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "\n\nSorry, I can't help with that one. Feel free to ask about Ganesh's experience, skills or projects."
            )
          );
        }
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) {
          controller.enqueue(encoder.encode("The assistant is busy right now. Please try again in a moment."));
        } else if (error instanceof Anthropic.AuthenticationError) {
          console.error("Chat: invalid Anthropic credentials");
          controller.enqueue(encoder.encode("The assistant is temporarily unavailable."));
        } else {
          console.error("Chat error:", error);
          controller.enqueue(
            encoder.encode(
              `The assistant is unavailable right now. You can reach Ganesh directly at ${profile.email}.`
            )
          );
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
