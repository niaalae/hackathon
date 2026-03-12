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
import { useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { to: 'dashboard', label: 'Home', icon: Gem },
  { to: 'maps', label: 'Maps', icon: MapPinned },
  { to: 'match', label: 'Match', icon: Flame, center: true },
  { to: 'trips', label: 'Trips', icon: CalendarRange },
  { to: 'groups', label: 'Groups', icon: UsersRound },
]

const LABEL_ITEMS = [
  ...NAV_ITEMS.map(({ to, label }) => ({ to, label })),
  { to: 'ai', label: 'AI Agent' },
]

export default function UserLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [chatOpen, setChatOpen] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Hi! I can help plan routes, estimate costs, and find safe spots.' },
  ])

  const activePath = useMemo(() => location.pathname.replace(/\/+$/, ''), [location.pathname])
  const activeLabel = useMemo(() => {
    if (activePath === '/user' || activePath === '/user/dashboard') return 'Dashboard'
    const match = LABEL_ITEMS.find((l) => activePath.startsWith('/user/' + l.to))
    return match?.label ?? 'User space'
  }, [activePath])

  const handleSend = () => {
    if (!messageInput.trim()) return
    const newMessage = { id: String(Date.now()), role: 'user', content: messageInput.trim() }
    const reply = { id: String(Date.now() + 1), role: 'assistant', content: 'Got it! I will tailor a plan for that.' }
    setMessages((prev) => [...prev, newMessage, reply])
    setMessageInput('')
  }

  const ChatBody = (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between border-b border-zinc-200 px-4 py-3'>
        <div className='flex items-center gap-2 text-sm font-semibold text-zinc-900'>
          <Sparkles className='h-4 w-4 text-orange-500' />
          AI Agent
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
      <div className='flex-1 space-y-3 overflow-y-auto px-4 py-3'>
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                message.role === 'user' ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className='border-t border-zinc-200 p-3'>
        <div className='flex gap-2'>
          <input
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            placeholder='Ask the AI agent...'
            className='h-10 flex-1 rounded-full border border-zinc-200 px-4 text-sm text-zinc-600'
          />
          <button
            onClick={handleSend}
            className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white'
          >
            <Send className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <main className='min-h-screen bg-[#f4f6f9] text-zinc-900'>
      <div className='mx-auto max-w-[1200px] px-4 pb-24 pt-6 sm:px-6'>
        <header className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <div className='text-lg font-semibold text-zinc-900'>Dashboard</div>
            <div className='text-xs text-zinc-500'>User: {user?.name ?? 'Guest'}</div>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <button
              onClick={() => navigate('/')}
              className='flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to site
            </button>
            <button
              onClick={() => logout().then(() => navigate('/'))}
              className='flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(24,24,27,0.2)]'
            >
              <LogOut className='h-4 w-4' />
              Sign out
            </button>
          </div>
        </header>

        <section className='rounded-[28px] border border-[#eceff3] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8'>
          <Outlet />
        </section>
      </div>

      <button
        onClick={() => {
          setChatOpen((prev) => !prev)
          setChatExpanded(false)
        }}
        className='fixed bottom-3 right-4 z-[2010] flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_16px_36px_rgba(249,115,22,0.35)]'
      >
        <Sparkles className='h-5 w-5' />
      </button>

      {chatOpen && !chatExpanded && (
        <div className='fixed bottom-20 right-4 z-[2020] h-[420px] w-[320px] overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.2)]'>
          {ChatBody}
        </div>
      )}

      {chatExpanded && (
        <div className='fixed inset-0 z-[2030] flex items-center justify-center bg-black/40 p-4'>
          <div className='h-[min(82vh,720px)] w-[min(940px,94vw)] overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.3)]'>
            {ChatBody}
          </div>
        </div>
      )}

      <nav className='fixed bottom-3 left-1/2 z-[2000] w-[min(520px,92vw)] -translate-x-1/2 rounded-full border border-[#eceff3] bg-white/95 px-2 py-1 shadow-[0_12px_30px_rgba(15,23,42,0.14)] backdrop-blur'>
        <div className='flex items-end justify-between'>
          {NAV_ITEMS.map((item) => {
            const isActive = activePath === '/user' ? item.to === 'dashboard' : activePath.startsWith('/user/' + item.to)
            const isCenter = item.center
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex flex-1 flex-col items-center ${isCenter ? '-mt-6' : ''}`}
              >
                <span
                  className={`flex items-center justify-center rounded-full ${
                    isCenter
                      ? 'h-11 w-11 bg-orange-500 text-white shadow-[0_12px_24px_rgba(249,115,22,0.35)]'
                      : isActive
                        ? 'h-8 w-8 bg-orange-500 text-white'
                        : 'h-8 w-8 border border-zinc-200 bg-white text-zinc-500'
                  }`}
                >
                  <item.icon className={`${isCenter ? 'h-5 w-5' : 'h-4 w-4'}`} />
                </span>
                <span
                  className={`text-[10px] transition-all duration-200 ${
                    isCenter ? 'font-semibold text-orange-600' : isActive ? 'text-orange-600' : 'text-zinc-400'
                  } opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </main>
  )
}
