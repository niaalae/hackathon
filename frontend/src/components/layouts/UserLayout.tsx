import { useAuthStore } from '@/stores/authStore'
import {
  ArrowLeft,
  Flame,
  Gem,
  LogOut,
  MapPinned,
  Maximize2,
  Send,
  Sparkles,
  UsersRound,
  X,
  CalendarRange,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import api from '@/lib/api'

import { useTranslation } from 'react-i18next'

export default function UserLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, logout } = useAuthStore()
  const isRtl = i18n.language === 'ar'

  const NAV_ITEMS = [
    { to: 'dashboard', label: t('user.sidebar.home'), icon: Gem },
    { to: 'maps', label: t('user.sidebar.maps'), icon: MapPinned },
    { to: 'match', label: t('user.sidebar.match'), icon: Flame, center: true },
    { to: 'trips', label: t('user.sidebar.trips'), icon: CalendarRange },
    { to: 'groups', label: t('user.sidebar.groups'), icon: UsersRound },
  ]

  const [chatOpen, setChatOpen] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(false)
  const [chatSending, setChatSending] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [autoPromptSent, setAutoPromptSent] = useState(false)
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: t('user.chat.welcome') },
  ])

  useEffect(() => {
    // Update initial message when language changes
    setMessages(prev => prev.map(m => m.id === '1' ? { ...m, content: t('user.chat.welcome') } : m))
  }, [t])

  const activePath = useMemo(() => location.pathname.replace(/\/+$/, ''), [location.pathname])
  const isAiPage = activePath.startsWith('/user/ai')

  const handleSend = async (message?: string) => {
    const content = (message ?? messageInput).trim()
    if (!content || chatSending) return
    setChatSending(true)
    setMessages((prev) => [...prev, { id: String(Date.now()), role: 'user', content }])
    setMessageInput('')
    try {
      const { data } = await api.post('/agent/hero', { prompt: content })
      const replyText = [data?.answer, data?.followUpQuestion].filter(Boolean).join(' ')
      if (data?.followUpQuestion) {
        setChatOpen(true)
        setChatExpanded(true)
      }
      if (!data?.followUpQuestion && data?.intent) {
        const nextRoute =
          data.intent === 'booking'
            ? '/user/trips'
            : data.intent === 'collaboration'
              ? '/user/match'
              : data.intent === 'guide'
                ? '/user/maps'
                : data.intent === 'new_trip'
                  ? '/user/trips'
                  : null
        if (nextRoute && !location.pathname.startsWith(nextRoute)) {
          navigate(nextRoute)
        }
      }
      sessionStorage.setItem('userAgentResponse', JSON.stringify(data))
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), role: 'assistant', content: replyText || 'Got it! I will tailor a plan for that.' },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), role: 'assistant', content: t('user.chat.error') },
      ])
    } finally {
      setChatSending(false)
    }
  }

  useEffect(() => {
    try {
      sessionStorage.setItem('userChatHistory', JSON.stringify(messages))
    } catch { }
  }, [messages])

  useEffect(() => {
    const heroPrompt = searchParams.get('prompt') ?? sessionStorage.getItem('heroPrompt')
    if (!heroPrompt || autoPromptSent) return
    setChatOpen(true)
    setChatExpanded(false)
    setAutoPromptSent(true)
    sessionStorage.removeItem('heroPrompt')
    handleSend(heroPrompt)
  }, [searchParams, autoPromptSent])

  const ChatBody = (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between border-b border-zinc-200 px-4 py-3'>
        <div className='flex items-center gap-2 text-sm font-semibold text-zinc-900'>
          <Sparkles className='h-4 w-4 text-orange-500' />
          {t('user.chat.title')}
        </div>
        <div className='flex items-center gap-2'>
          {!chatExpanded && (
            <button
              onClick={() => setChatExpanded(true)}
              className='rounded-full border border-zinc-200 p-2 text-zinc-500 hover:text-zinc-700'
            >
              <Maximize2 className='h-4 w-4' />
            </button>
          )}
          <button
            onClick={() => {
              setChatOpen(false)
              setChatExpanded(false)
            }}
            className='rounded-full border border-zinc-200 p-2 text-zinc-500 hover:text-zinc-700'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>
      <div className='flex-1 space-y-3 overflow-y-auto px-4 py-3 bg-gradient-to-b from-white via-white to-orange-50/40'>
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${message.role === 'user' ? 'bg-orange-500 text-white shadow-[0_10px_22px_rgba(249,115,22,0.25)]' : 'bg-white text-zinc-700 border border-zinc-200'
                }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {chatSending && (
          <div className='flex justify-start'>
            <div className='rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500'>
              <span className='typing-dots'>
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>
      <div className='border-t border-zinc-200 p-3'>
        <div className='flex gap-2'>
          <input
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            placeholder={t('user.chat.input')}
            className='h-10 flex-1 rounded-full border border-zinc-200 px-4 text-sm text-zinc-600 focus:border-orange-300'
          />
          <button
            onClick={() => handleSend()}
            className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(249,115,22,0.35)]'
          >
            <Send className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <main className='min-h-screen bg-[#f4f6f9] text-zinc-900' dir={isRtl ? 'rtl' : 'ltr'}>
      <div className='mx-auto max-w-[1200px] px-4 pb-24 pt-6 sm:px-6'>
        <header className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <div className='text-lg font-semibold text-zinc-900'>{t('user.header.dashboard')}</div>
            <div className='text-xs text-zinc-500'>{t('user.header.user')}: {user?.name ?? 'Guest'}</div>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <button
              onClick={() => navigate('/')}
              className='flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm'
            >
              <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              {t('user.header.back')}
            </button>
            <button
              onClick={() => logout().then(() => navigate('/'))}
              className='flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(24,24,27,0.2)]'
            >
              <LogOut className='h-4 w-4' />
              {t('user.header.signout')}
            </button>
          </div>
        </header>

        <section className='rounded-[28px] border border-[#eceff3] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8'>
          <div key={activePath} className='animate-fade-up'>
            <Outlet />
          </div>
        </section>
      </div>

      <div className='fixed bottom-4 left-1/2 z-[2000] w-full -translate-x-1/2 px-4'>
        <div className='mx-auto flex w-[min(620px,92vw)] items-end justify-center gap-3 relative animate-dock-in'>
          <nav className='w-[min(560px,92vw)] rounded-full border border-[#eceff3] bg-white/95 px-3 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur transition-all duration-300'>
            <div className='flex items-end justify-between'>
              {NAV_ITEMS.map((item) => {
                const isActive = activePath === '/user' ? item.to === 'dashboard' : activePath.startsWith('/user/' + item.to)
                const isCenter = item.center
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`group flex flex-1 flex-col items-center ${isCenter ? '-mt-7' : ''}`}
                  >
                    <span
                      className={`flex items-center justify-center rounded-full transition-all duration-300 ${isCenter
                        ? 'h-12 w-12 bg-orange-500 text-white shadow-[0_14px_28px_rgba(249,115,22,0.38)] ring-4 ring-orange-500/15'
                        : isActive
                          ? 'h-9 w-9 bg-zinc-900 text-white shadow-[0_10px_22px_rgba(24,24,27,0.2)]'
                          : 'h-9 w-9 border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-800 hover:shadow-[0_10px_18px_rgba(24,24,27,0.12)]'
                        }`}
                    >
                      <item.icon className={`${isCenter ? 'h-5 w-5' : 'h-4 w-4'}`} />
                    </span>
                    <span
                      className={`text-[10px] transition-all duration-200 ${isCenter ? 'font-semibold text-orange-600' : isActive ? 'text-orange-600' : 'text-zinc-400'
                        } opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </nav>

        </div>
      </div>

      {!isAiPage && (
        <>
          <button
            onClick={() => {
              setChatOpen((prev) => !prev)
              setChatExpanded(false)
            }}
            className='fixed bottom-6 right-5 z-[2010] flex h-12 w-12 -translate-y-2 items-center justify-center rounded-full bg-zinc-900 text-white shadow-[0_16px_32px_rgba(24,24,27,0.28)] ring-4 ring-orange-500/10 transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-[0_20px_36px_rgba(24,24,27,0.36)]'
          >
            <svg viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5 -translate-y-[1px]'>
              <path d='M12 2C17.5228 2 22 6.47715 22 12C22 14.7096 20.9205 17.1697 19.1709 18.9697C17.3551 20.8376 14.8124 22 12 22C9.18756 22 6.64488 20.8376 4.8291 18.9697C3.07949 17.1697 2 14.7096 2 12C2 6.47715 6.47715 2 12 2ZM12 16C10.0022 16 8.20124 16.8375 6.9248 18.1816C8.30642 19.3175 10.0724 20 12 20C13.9274 20 15.6927 19.3173 17.0742 18.1816C15.7978 16.8377 13.9975 16 12 16ZM12 4C7.58172 4 4 7.58172 4 12C4 13.7701 4.57462 15.4044 5.54785 16.7295C7.1822 15.0483 9.46797 14 12 14C14.5318 14 16.8169 15.0485 18.4512 16.7295C19.4246 15.4043 20 13.7703 20 12C20 7.58172 16.4183 4 12 4ZM11.5293 5.31934C11.7058 4.89329 12.2943 4.89329 12.4707 5.31934L12.7236 5.93066C13.1556 6.97343 13.9615 7.80622 14.9746 8.25684L15.6924 8.5752C16.1029 8.75796 16.1028 9.35627 15.6924 9.53906L14.9326 9.87695C13.9448 10.3163 13.1534 11.1193 12.7139 12.1279L12.4668 12.6934C12.2864 13.1074 11.7137 13.1074 11.5332 12.6934L11.2871 12.1279C10.8476 11.1193 10.0552 10.3163 9.06738 9.87695L8.30762 9.53906C7.89719 9.35628 7.89717 8.75795 8.30762 8.5752L9.02539 8.25684C10.0385 7.80623 10.8445 6.97345 11.2764 5.93066L11.5293 5.31934Z' />
            </svg>
          </button>

          {chatOpen && !chatExpanded && (
            <div className='fixed bottom-28 right-5 z-[2020] h-[420px] w-[320px] overflow-hidden rounded-[22px] border border-[#eceff3] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] animate-fade-pop'>
              {ChatBody}
            </div>
          )}

          {chatExpanded && (
            <div className='fixed inset-0 z-[2030] flex items-center justify-center bg-black/40 p-4 animate-fade-pop'>
              <div className='h-[min(84vh,760px)] w-[min(980px,94vw)] overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.3)]'>
                {ChatBody}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .animate-fade-up {
          animation: fadeUp 420ms ease-out both;
        }
        .animate-fade-pop {
          animation: fadePop 260ms ease-out both;
        }
        .animate-dock-in {
          animation: dockIn 420ms ease-out both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadePop {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dockIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-dots { display: inline-flex; gap: 6px; align-items: center; }
        .typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #f97316; display: inline-block; animation: typingPulse 1s infinite ease-in-out; }
        .typing-dots span:nth-child(2) { animation-delay: 0.15s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes typingPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  )
}
