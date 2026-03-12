import { Injectable, Logger } from '@nestjs/common';

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);
    private readonly apiKey = process.env.GEMINI_API_KEY ?? '';
    private readonly model = process.env.GEMINI_MODEL ?? 'gemini-3-flash-preview';
    private readonly endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

    private readonly systemPrompt = [
        'You are Trippple AI, a friendly travel assistant for Morocco (especially the Fes-Meknes region).',
        'You ONLY answer questions about travel, trips, tourism, hotels, riads, restaurants, activities, transport, budgets, and safety in Morocco.',
        'If the user asks about anything unrelated to travel or Morocco, politely say: "I can only help with travel-related questions about Morocco! 🇲🇦"',
        'Keep answers short (under 80 words), friendly, and helpful.',
        'Use occasional emojis to feel warm.',
        'Never return JSON. Reply in plain text only.',
    ].join(' ');

    async chat(message: string, history: ChatMessage[]): Promise<string> {
        const trimmed = message.trim();
        if (!trimmed) return 'Please ask me something about your trip! 🧳';

        if (!this.apiKey) {
            return 'The AI agent is not configured yet. Please add your Gemini API key to .env 🔑';
        }

        // Build conversation context
        const conversationParts = [
            { text: this.systemPrompt },
            ...history.slice(-6).map((msg) => ({
                text: `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`,
            })),
            { text: `User: ${trimmed}` },
        ];

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': this.apiKey,
                },
                body: JSON.stringify({
                    contents: [{ parts: conversationParts }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 256,
                    },
                }),
            });

            if (!response.ok) {
                this.logger.warn(`Gemini API error: ${response.status}`);
                return 'Sorry, I had trouble thinking. Try again in a moment! 🙏';
            }

            const data = await response.json();
            const text =
                data?.candidates?.[0]?.content?.parts
                    ?.map((part: { text?: string }) => part.text ?? '')
                    .join('') ?? '';

            return text.trim() || 'Hmm, I could not come up with an answer. Try rephrasing? 🤔';
        } catch (error) {
            this.logger.warn(`Chat API failed: ${String(error)}`);
            return 'Something went wrong. Please try again! 🔄';
        }
    }
}
