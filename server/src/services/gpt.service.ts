import OpenAI from "openai";
import { getRandomPhrase } from "../utils/utils";

export class GptService {
  private static instance: GptService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public static get Instance(): GptService {
    if (!this.instance) {
      this.instance = new GptService();
    }
    return this.instance;
  }

  public async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a real person engaging in a natural, friendly, and casual conversation. Be authentic, use everyday language, and respond as if you were talking to a friend, include emojis or light humor in your responses. Avoid sounding like an assistant."
          },
          {role: "user", content: prompt}
        ],
        temperature: 0.8,
      });

      return response.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
      console.error("Failed to generate AI response:", error.message);

      return getRandomPhrase();
    }
  }
}
