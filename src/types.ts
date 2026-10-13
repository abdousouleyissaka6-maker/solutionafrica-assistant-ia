/**

* Variables de configuration de IA Africa Core
  */

export interface Env {
AI: Ai;

EXA_API_KEY?: string;

WHATSAPP_VERIFY_TOKEN?: string;
WHATSAPP_ACCESS_TOKEN?: string;
WHATSAPP_PHONE_NUMBER_ID?: string;

ASSETS: {
fetch: (request: Request) => Promise<Response>;
};
}

/**

* Message de conversation
  */
  export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  }
