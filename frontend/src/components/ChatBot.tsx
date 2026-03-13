import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '@/lib/api'

type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
}



export default function ChatBot() {
    const { t, i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: '0', role: 'assistant', content: t('chatbot.initial') }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const isRtl = i18n.language === 'ar'

    useEffect(() => {
        // Update initial message when language changes
        setMessages(prev => prev.map(m => m.id === '0' ? { ...m, content: t('chatbot.initial') } : m))
    }, [t])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const send = async () => {
        const text = input.trim()
        if (!text || loading) return

        const userMsg: Message = { id: String(Date.now()), role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const history = messages.filter(m => m.id !== '0').map(({ role, content }) => ({ role, content }))
            const { data } = await api.post<{ reply: string }>('/agent/chat', {
                message: text,
                history,
            })
            setMessages(prev => [...prev, {
                id: String(Date.now() + 1),
                role: 'assistant',
                content: data.reply,
            }])
        } catch {
            setMessages(prev => [...prev, {
                id: String(Date.now() + 1),
                role: 'assistant',
                content: t('chatbot.error'),
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-5 right-5 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)] transition hover:bg-orange-600 active:scale-95"
                aria-label="Open chat"
            >
                {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            </button>

            {/* Chat window */}
            {open && (
                <div
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="fixed bottom-20 right-5 z-[9999] flex h-[min(460px,calc(100vh-120px))] w-[min(360px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
                >

                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500">
                            <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-zinc-900">{t('chatbot.title')}</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${msg.role === 'user'
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

                    {/* Input */}
                    <div className="border-t border-zinc-100 px-3 py-3">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') send() }}
                                placeholder={t('chatbot.placeholder')}
                                className="h-9 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white"
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
            )}
        </>
    )
}
