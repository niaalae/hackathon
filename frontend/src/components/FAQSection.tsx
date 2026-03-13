import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageSquare, Send, X, Loader2, HelpCircle } from 'lucide-react'
import api from '@/lib/api'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function ZellijLineBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.25]"
        viewBox="0 0 1600 1000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="zellijFaqPattern" width="220" height="220" patternUnits="userSpaceOnUse">
            <g
              stroke="rgba(37,99,235,0.26)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="110,22 124,60 110,72 96,60" />
              <polygon points="178,42 162,74 150,68 154,34" />
              <polygon points="198,110 160,124 148,110 160,96" />
              <polygon points="178,178 150,152 154,140 166,146" />
              <polygon points="110,198 96,160 110,148 124,160" />
              <polygon points="42,178 70,152 66,140 54,146" />
              <polygon points="22,110 60,96 72,110 60,124" />
              <polygon points="42,42 70,68 66,80 54,74" />
              <polygon points="110,72 138,80 148,110 138,140 110,148 82,140 72,110 82,80" />
              <line x1="28" y1="22" x2="42" y2="42" />
              <line x1="192" y1="22" x2="178" y2="42" />
              <line x1="28" y1="198" x2="42" y2="178" />
              <line x1="192" y1="198" x2="178" y2="178" />
              <line x1="68" y1="10" x2="54" y2="34" />
              <line x1="152" y1="10" x2="166" y2="34" />
              <line x1="68" y1="210" x2="54" y2="186" />
              <line x1="152" y1="210" x2="166" y2="186" />
            </g>
          </pattern>

          <radialGradient
            id="leftGlowFaq"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(300 260) rotate(90) scale(360 420)"
          >
            <stop offset="0%" stopColor="rgba(59,130,246,0.10)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </radialGradient>

          <radialGradient
            id="rightGlowFaq"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1280 240) rotate(90) scale(340 420)"
          >
            <stop offset="0%" stopColor="rgba(249,115,22,0.08)" />
            <stop offset="100%" stopColor="rgba(249,115,22,0)" />
          </radialGradient>
        </defs>

        <rect width="1600" height="1000" fill="url(#zellijFaqPattern)" />
        <rect width="1600" height="1000" fill="url(#leftGlowFaq)" />
        <rect width="1600" height="1000" fill="url(#rightGlowFaq)" />
      </svg>
    </div>
  )
}

function ChatBot({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: t('chatbot.initial') },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isRtl = i18n.language === 'ar'

  useEffect(() => {
    setMessages(prev =>
      prev.map(m => (m.id === '0' ? { ...m, content: t('chatbot.initial') } : m))
    )
  }, [t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.id !== '0')
        .map(({ role, content }) => ({ role, content }))

      const { data } = await api.post<{ reply: string }>('/agent/chat', {
        message: text,
        history,
      })

      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: data.reply,
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: t('chatbot.error'),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed bottom-0 right-0 z-[9999] flex h-[100dvh] w-full flex-col overflow-hidden border-t border-zinc-200 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)] sm:bottom-20 sm:right-5 sm:h-[min(460px,calc(100vh-120px))] sm:w-[360px] sm:rounded-2xl sm:border"
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-zinc-100 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500">
          <MessageSquare className="h-4 w-4 text-white" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold text-zinc-900">{t('chatbot.title')}</p>
        </div>

        <button onClick={onClose} className="-mr-2 p-2 text-zinc-400 hover:text-zinc-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2.5 text-xs text-zinc-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t('chatbot.thinking')}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-zinc-100 bg-white px-3 py-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') send()
            }}
            placeholder={t('chatbot.placeholder')}
            className="h-9 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-base text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white sm:text-sm"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [chatOpen, setChatOpen] = useState(false)

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q4'), answer: t('faq.a4') },
  ]

  return (
    <section
      className="relative w-full overflow-hidden bg-white px-4 py-20 md:px-8 md:py-32"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <ZellijLineBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:items-start md:gap-24">
        <div
          className={`h-fit w-full md:sticky md:top-32 md:w-1/3 ${
            isRtl ? 'md:text-right' : 'md:text-left'
          }`}
        >
          <div className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500 sm:text-xs">
            FAQ
          </div>

          <h2 className="mt-5 mb-4 text-3xl font-semibold tracking-tight text-slate-900 md:mb-6 md:text-5xl">
            {t('faq.title')}
          </h2>

          <p className="max-w-sm text-base leading-relaxed text-slate-500 md:text-lg">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="w-full md:w-2/3">
          {faqs.map((faq, index) => (
            <div key={index} className="w-full border-b border-slate-200 py-6">
              <h3
                className={`text-base font-medium text-orange-500 md:text-lg ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
              >
                {faq.question}
              </h3>
              <p
                className={`mt-3 max-w-2xl text-sm text-slate-500 md:text-base ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
              >
                {faq.answer}
              </p>
            </div>
          ))}

          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-orange-100 bg-orange-50/60 px-6 py-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 shrink-0 text-orange-500" />
              <p className="text-sm font-medium text-slate-700 md:text-base">
                Have a question in mind? Ask our assistant!
              </p>
            </div>

            <button
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] transition hover:bg-orange-600 active:scale-95"
            >
              <MessageSquare className="h-4 w-4" />
              Ask our assistant
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setChatOpen(o => !o)}
        className="fixed bottom-5 right-5 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)] transition hover:bg-orange-600 active:scale-95"
        aria-label="Open chat"
      >
        {chatOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
    </section>
  )
}