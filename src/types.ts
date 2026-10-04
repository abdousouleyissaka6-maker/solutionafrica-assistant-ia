/**
 * Type definitions for the LLM chat application.
 */

export interface Env {
  AI: Ai;

  EXA_API_KEY?: string;

  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

/**
 * Represents a chat message.
 */
export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}
