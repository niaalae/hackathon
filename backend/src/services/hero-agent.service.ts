import { Injectable, Logger } from '@nestjs/common';

type BookingSuggestion = {
  title: string;
  type: 'flight' | 'stay' | 'activity' | 'transport' | 'rental' | 'guide' | 'other';
  priceRange?: string;
  notes?: string;
};

type HeroAgentResponse = {
  answer: string;
  intent?: 'booking' | 'information' | 'collaboration' | 'guide' | 'new_trip';
  followUpQuestion?: string;
  bookings: BookingSuggestion[];
};

@Injectable()
export class HeroAgentService {
  private readonly logger = new Logger(HeroAgentService.name);
  private readonly apiKey = process.env.GEMINI_API_KEY ?? '';
  private readonly model = process.env.GEMINI_MODEL ?? 'gemini-3-flash-preview';
  private readonly endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

  private fallbackBookings(prompt: string): BookingSuggestion[] {
    const short = prompt.slice(0, 48).trim();
    return [
      {
        title: `Flight match: ${short || 'Flexible dates'}`,
        type: 'flight',
        priceRange: 'Budget to mid-range',
        notes: 'We will surface the best time and price window.',
      },
      {
        title: 'Stay pick: central + high-rated',
        type: 'stay',
        priceRange: 'Mid-range',
        notes: 'Walking distance to key spots, flexible cancel.',
      },
      {
        title: 'Top activity: curated local experience',
        type: 'activity',
        priceRange: 'From $',
        notes: 'Shortlist with reviews and safety checks.',
      },
    ];
  }

  private extractJson(text: string): string | null {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    return text.slice(start, end + 1);
  }

  async generateHeroReply(prompt: string): Promise<HeroAgentResponse> {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      return {
        answer: 'Tell me your destination, dates, budget, and vibe. I will handle the rest.',
        intent: 'information',
        followUpQuestion: 'Do you want to create a new trip or match with a collaborator?',
        bookings: this.fallbackBookings(''),
      };
    }

    if (!this.apiKey) {
      return {
        answer:
          'I can suggest a plan, but the live AI agent is not connected yet. Here is a quick starter plan.',
        intent: 'information',
        followUpQuestion: 'Do you want to create a new trip with these suggestions?',
        bookings: this.fallbackBookings(cleanPrompt),
      };
    }

    const systemInstruction = [
      'You are a travel booking assistant.',
      'Return only valid JSON with keys: answer (string), intent (string), followUpQuestion (string, optional), bookings (array).',
      'Intent must be one of: booking, information, collaboration, guide, new_trip.',
      'If the user wants collaboration but there is no existing trip, set intent to new_trip and ask to create one.',
      'If the user asks for a guide and none are found, suggest nearby options in followUpQuestion.',
      'Each booking has: title, type, priceRange (optional), notes (optional).',
      'Keep answer under 70 words and bookings 3 to 5 items.',
      'No markdown, no extra keys.',
    ].join(' ');

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemInstruction}\nUser: ${cleanPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 512,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.warn(`Gemini API error: ${response.status} ${errorText}`);
        return {
          answer:
            'I had trouble reaching the booking agent. Here is a quick shortlist to get you started.',
          intent: 'information',
          followUpQuestion: 'Should I create a new trip from these suggestions?',
          bookings: this.fallbackBookings(cleanPrompt),
        };
      }

      const data = await response.json();
      const raw =
        data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('') ??
        '';
      const jsonText = this.extractJson(raw) ?? '';

      if (!jsonText) {
        return {
          answer: raw.trim() || 'Here is a quick plan to get started.',
          intent: 'information',
          followUpQuestion: 'Should I create a new trip or keep browsing?',
          bookings: this.fallbackBookings(cleanPrompt),
        };
      }

      const parsed = JSON.parse(jsonText) as HeroAgentResponse;
      const bookings = Array.isArray(parsed.bookings) ? parsed.bookings : this.fallbackBookings(cleanPrompt);

      return {
        answer: parsed.answer?.trim() || 'Here is a quick plan to get started.',
        intent: parsed.intent,
        followUpQuestion: parsed.followUpQuestion,
        bookings,
      };
    } catch (error) {
      this.logger.warn(`Gemini API failed: ${String(error)}`);
      return {
        answer:
          'I had trouble generating live recommendations. Here is a quick starter plan.',
        intent: 'information',
        followUpQuestion: 'Should I create a new trip from these suggestions?',
        bookings: this.fallbackBookings(cleanPrompt),
      };
    }
  }
}
