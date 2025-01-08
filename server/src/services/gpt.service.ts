import OpenAI from "openai";

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
        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
        });

        return response.choices[0]?.message?.content || "No response generated.";
    }
}
