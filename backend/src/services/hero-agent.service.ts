import { Injectable, Logger } from '@nestjs/common';

type BookingSuggestion = {
  title: string;
  type: 'flight' | 'stay' | 'activity' | 'transport' | 'rental' | 'guide' | 'other';
  priceRange?: string;
  notes?: string;
};

type TravelPlan = {
  from: { city: string; country: string };
  to: { city: string; country: string };
  duration: number;
  totalBudget: number;
  totalEstimatedCost: number;
  budgetMatch: number;
  flights: FlightOption[];
  hotels: HotelOption[];
  itinerary: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  tips: string[];
  packingList: string[];
};

type FlightOption = {
  airline: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  isBestValue: boolean;
};

type HotelOption = {
  name: string;
  stars: number;
  pricePerNight: number;
  totalPrice: number;
  location: string;
  rating: number;
  amenities: string[];
  isRecommended: boolean;
};

type DayPlan = {
  day: number;
  theme: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
  estimatedDailyCost: number;
};

type BudgetBreakdown = {
  flights: number;
  hotels: number;
  food: number;
  activities: number;
  transport: number;
  misc: number;
};

type HeroAgentResponse = {
  answer: string;
  intent?: 'booking' | 'information' | 'collaboration' | 'guide' | 'new_trip';
  followUpQuestion?: string;
  bookings: BookingSuggestion[];
  travelPlan?: TravelPlan;
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

    const systemInstruction = `You are a Morocco travel specialist AI. ONLY plan trips to Moroccan cities 
(Fes, Marrakech, Casablanca, Chefchaouen, Essaouira, Agadir, Rabat, Tangier, 
Merzouga, Ouarzazate, Imlil, Dakhla). 
If the user asks for any destination outside Morocco respond with: 
answer: We currently only support trips to Morocco. Choose a Moroccan city 
and I will build you the perfect plan, intent: information, bookings: [], travelPlan: null.
For valid Morocco trips extract: origin city+country, destination Moroccan city, 
budget in USD, duration in days.
Return ONLY valid JSON with exactly these keys: 
answer (2 sentence friendly summary), 
intent (one of: booking/information/collaboration/guide/new_trip),
followUpQuestion (optional string),
bookings (3-5 items each with title/type/priceRange/notes),
travelPlan (full object with all fields below).
travelPlan must include:
- from: origin city and country from user prompt
- to: the Moroccan destination city and country Morocco  
- duration: number of days as integer
- totalBudget: user budget in USD as integer
- totalEstimatedCost: realistic total cost in USD as integer
- budgetMatch: 0-100 score how well plan fits budget
- flights: array of 2-3 realistic options, airlines must be real 
  (Royal Air Maroc, Ryanair, Air Arabia, Transavia, easyJet), 
  prices realistic in USD, isBestValue true on cheapest
- hotels: array of 2-3 real riad or hotel options in the destination city,
  stars 2-5, realistic pricePerNight in USD, 
  totalPrice = pricePerNight * duration,
  amenities array of 3-5 strings,
  isRecommended true on best value
- itinerary: one DayPlan per day, realistic Moroccan activities,
  morning/afternoon/evening each array of 2-3 activity strings with emoji prefix,
  estimatedDailyCost in USD realistic
- budgetBreakdown: flights/hotels/food/activities/transport/misc all in USD,
  must sum close to totalEstimatedCost
- tips: exactly 6 Morocco-specific travel tips 
  (culture, safety, currency MAD, dress code, bargaining, transport)
- packingList: exactly 12 items Morocco-appropriate 
  (weather, modest clothing, medications, etc)
No markdown. No extra keys. Valid JSON only. 
maxOutputTokens must handle full itinerary.`;

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
            temperature: 0.3,
            topP: 0.9,
            maxOutputTokens: 2500,
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
        travelPlan: parsed.travelPlan,
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
