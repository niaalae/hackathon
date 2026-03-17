import { useEffect, useRef, useState } from 'react'
import { Loader2, Send, Sparkles, X } from 'lucide-react'
import { requestHeroAgent } from '@/lib/agent'
import { useWindowSize } from '@/hooks/useWindowSize'

type BookingSuggestion = {
  title: string
  type: string
  priceRange?: string
  notes?: string
}

type AgentActionType =
  | 'SHOW_TRIPS'
  | 'SHOW_GROUPS'
  | 'SHOW_BOOKINGS'
  | 'SHOW_GUIDES'
  | 'SHOW_MAP'
  | 'SHOW_QUESTS'

type AgentAction = {
  type: AgentActionType
  payload?: Record<string, unknown>
}

type HeroAgentResponse = {
  answer: string
  intent: 'booking' | 'information' | 'collaboration' | 'guide' | 'new_trip'
  followUpQuestion: string | null
  bookings: BookingSuggestion[]
  actions: AgentAction[]
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AgentBubble() {
  const { isMobile } = useWindowSize()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (isMobile) return
    const pendingPrompt = sessionStorage.getItem('heroPrompt')
    if (!pendingPrompt) return
    sessionStorage.removeItem('heroPrompt')
    setOpen(true)
    void sendMessage(pendingPrompt)
  }, [isMobile])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: 'user', content: trimmed },
    ])
    setInput('')
    setLoading(true)

    try {
      const { data } = await requestHeroAgent<HeroAgentResponse>(trimmed)
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: data.answer,
        },
      ])
      const followUp = data.followUpQuestion?.trim()
      if (followUp) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-followup`,
            role: 'assistant',
            content: followUp,
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          content: 'I had trouble reaching the agent. Try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (isMobile) return null

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white shadow-[0_18px_40px_rgba(249,115,22,0.35)] ring-2 ring-white/80 transition duration-200 hover:translate-y-[-1px] hover:shadow-[0_24px_50px_rgba(249,115,22,0.4)] active:scale-95"
        aria-label="Open AI agent"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>

      <div
        className={`fixed bottom-20 right-6 z-[9999] flex w-[360px] max-w-[90vw] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,0.18)] ring-1 ring-orange-100/70 backdrop-blur-xl transition-all duration-200 ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-zinc-100/80 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.35)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-zinc-900">Trippple Agent</p>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online • personal travel concierge
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[360px] min-h-[220px] flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-orange-100 bg-orange-50/60 px-3 py-3 text-xs text-zinc-600">
              Try: “Plan a 4 day trip to Fes with a 2500 MAD budget”
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_12px_25px_rgba(249,115,22,0.25)]'
                    : 'border border-zinc-100 bg-white text-zinc-700 shadow-[0_10px_20px_rgba(24,24,27,0.06)]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-100 bg-white px-3 py-2 text-xs text-zinc-400 shadow-[0_8px_18px_rgba(24,24,27,0.06)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-zinc-100/80 px-3 py-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void sendMessage(input)
              }}
              placeholder="Ask the Trippple agent..."
              className="h-10 flex-1 rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200/50"
            />
            <button
              onClick={() => void sendMessage(input)}
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_12px_24px_rgba(249,115,22,0.3)] transition hover:translate-y-[-1px] hover:shadow-[0_16px_30px_rgba(249,115,22,0.35)] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
