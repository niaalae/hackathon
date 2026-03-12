import { useState } from 'react'
import {
  Brain,
  ChevronRight,
  Clock,
  DollarSign,
  Landmark,
  MapPin,
  Send,
  Sparkles,
  Star,
  Ticket,
  Utensils,
} from 'lucide-react'

const recommendations = [
  {
    id: '1',
    name: 'Jardin Jnan Sbil',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=60',
    description: 'Peaceful royal garden with fountains and shaded pathways.',
    location: 'Fes, Morocco',
    rating: 4.7,
    priceLevel: 1,
    duration: '1-2 hours',
  },
  {
    id: '2',
    name: 'Cafe Clock',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
    description: 'Rooftop dining with camel burger and cultural events.',
    location: 'Talaa Kebira, Fes Medina',
    rating: 4.8,
    priceLevel: 2,
    duration: '1-2 hours',
  },
  {
    id: '3',
    name: 'Bou Inania Madrasa',
    image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?w=800&auto=format&fit=crop&q=60',
    description: '14th-century madrasa with stunning zellige tilework.',
    location: 'Talaa Kebira, Fes',
    rating: 4.9,
    priceLevel: 1,
    duration: '1 hour',
  },
]

const costEstimates = [
  { label: 'Transport (4 days)', cost: '450 MAD', note: 'mix of taxis + CTM' },
  { label: 'Tickets & attractions', cost: '170 MAD', note: 'museums + monuments' },
  { label: 'Meals', cost: '360 MAD', note: 'local cafes + dinners' },
]

const quickPrompts = [
  { label: 'Best restaurants', icon: Utensils },
  { label: 'Historic sites', icon: Landmark },
  { label: 'Cost estimates', icon: DollarSign },
  { label: 'Tickets & tours', icon: Ticket },
]

const initialMessages = [
  {
    id: '1',
    role: 'assistant',
    content: 'Marhaba! I can plan routes, suggest safe spots, and optimize costs for your Fes-Meknes trip.',
    time: 'Just now',
  },
]

export default function UserAI() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: 'user', content: input, time: 'Just now' },
    ])
    setInput('')
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold text-zinc-900'>AI Travel Agent</h2>
        <p className='text-sm text-zinc-500'>Get personalized recommendations for Fes-Meknes</p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr,0.8fr]'>
        <div className='rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm'>
          <div className='space-y-4'>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${message.role === 'user' ? 'bg-orange-500 text-white' : 'bg-zinc-50 text-zinc-700'} rounded-2xl px-4 py-3 text-sm`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className='mt-4 flex flex-wrap gap-2'>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.label}
                className='flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600'
              >
                <prompt.icon className='h-4 w-4' />
                {prompt.label}
              </button>
            ))}
          </div>

          <div className='mt-4 flex gap-2'>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='Ask about routes, costs, or safe places...'
              className='h-10 flex-1 rounded-full border border-zinc-200 px-4 text-sm text-zinc-600'
            />
            <button onClick={handleSend} className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white'>
              <Send className='h-4 w-4' />
            </button>
          </div>
        </div>

        <div className='space-y-4'>
          <div className='rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center gap-2 text-sm font-semibold text-zinc-900'>
              <Sparkles className='h-4 w-4 text-orange-500' />
              Recommendations
            </div>
            <div className='mt-4 space-y-3'>
              {recommendations.map((rec) => (
                <div key={rec.id} className='flex gap-3 rounded-2xl border border-zinc-200 p-3'>
                  <img src={rec.image} alt={rec.name} className='h-16 w-16 rounded-xl object-cover' />
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm font-semibold text-zinc-900'>{rec.name}</div>
                      <span className='text-xs text-zinc-400'>{"$".repeat(rec.priceLevel)}</span>
                    </div>
                    <div className='mt-1 flex items-center gap-2 text-xs text-zinc-500'>
                      <MapPin className='h-3 w-3' />
                      {rec.location}
                    </div>
                    <div className='mt-2 flex items-center gap-2 text-xs text-zinc-500'>
                      <Star className='h-3 w-3 text-amber-500' />
                      {rec.rating}
                      <Clock className='ml-2 h-3 w-3' />
                      {rec.duration}
                    </div>
                    <div className='mt-2 text-xs text-zinc-500'>{rec.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className='mt-4 flex items-center gap-2 text-xs text-orange-600'>
              View more
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>

          <div className='rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center gap-2 text-sm font-semibold text-zinc-900'>
              <Brain className='h-4 w-4 text-orange-500' />
              Cost Snapshot
            </div>
            <div className='mt-4 space-y-3'>
              {costEstimates.map((item) => (
                <div key={item.label} className='flex items-center justify-between text-sm text-zinc-600'>
                  <div>
                    <div className='font-medium text-zinc-900'>{item.label}</div>
                    <div className='text-xs text-zinc-400'>{item.note}</div>
                  </div>
                  <div className='text-sm font-semibold text-zinc-900'>{item.cost}</div>
                </div>
              ))}
            </div>
            <div className='mt-4 rounded-2xl bg-orange-500/10 px-4 py-3 text-xs text-orange-600'>
              Estimated total per person: 4,500 MAD
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
