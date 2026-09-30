/**
 * IA Africa - Worker API optimisé
 * Chat avec Cloudflare Workers AI
 */

import { Env, ChatMessage } from "./types";

// Modèle plus léger et rapide pour les conversations multilingues.
const MODEL_ID = "@cf/meta/llama-3.2-3b-instruct";

const SYSTEM_PROMPT =
  "Tu es l'assistant IA de IA Africa. Réponds en français, clairement et brièvement. " +
  "Tu n'es pas l'administrateur de la plateforme. N'invente pas d'informations sur les responsables, " +
  "les comptes ou les services. Si une information n'est pas connue, dis-le simplement.";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Frontend
    if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    // Chat API
    if (url.pathname === "/api/chat") {
      if (request.method === "POST") {
        return handleChatRequest(request, env);
      }

      return new Response("Method not allowed", {
        status: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    return new Response("Not found", {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  },
} satisfies ExportedHandler<Env>;

async function handleChatRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const body = (await request.json()) as {
      messages?: ChatMessage[];
    };

    const messages = Array.isArray(body.messages)
      ? body.messages
      : [];

    if (!messages.some((msg) => msg.role === "system")) {
      messages.unshift({
        role: "system",
        content: SYSTEM_PROMPT,
      });
    }

    const inputs = {
      messages,
      max_tokens: 512,
      stream: true,
      temperature: 0.4,
    } satisfies AiTextGenerationInput & { stream: true };

    const stream = await env.AI.run<typeof MODEL_ID>(
      MODEL_ID,
      inputs,
    );

    return new Response(stream, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache",
        "connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error processing chat request:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process request",
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "content-type": "application/json",
        },
      },
    );
  }
		}
