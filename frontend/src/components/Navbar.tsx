'use client'

export default function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
              <span className="text-xs font-bold text-white">M</span>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold tracking-tight text-white">
              Morocco Pass
            </span>
            <span className="ml-2 hidden rounded bg-zinc-800/50 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline">
              BETA
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-[13px] text-zinc-400 md:flex">
          <a href="#features" className="transition-colors hover:text-white">
            Features
          </a>
          <a href="#cities" className="transition-colors hover:text-white">
            Cities
          </a>
          <a href="#pricing" className="transition-colors hover:text-white">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="h-9 px-3 text-[13px] text-zinc-400 transition-colors hover:text-white">
            Sign in
          </button>

          <button className="h-9 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 text-[13px] font-medium text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700">
            Get started
          </button>
        </div>
      </div>
    </header>
  )
}