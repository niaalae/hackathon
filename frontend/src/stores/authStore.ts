import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'TRAVELER' | 'GUIDE'
  preferences?: string | null
}

interface AuthStoreInterface {
  user: User | null
  token: string | null
  hasRefresh: boolean
  hydrated: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  setHasRefresh: (value: boolean) => void
  setHydrated: (hydrated: boolean) => void
  register: (data: RegisterData) => Promise<void>
  login: (data: LoginData) => Promise<{ user: User; token: string }>
  refresh: () => Promise<{ user: User; token: string } | undefined>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStoreInterface>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasRefresh: false,
      hydrated: false,
      setUser: (user) => {
        set({ user })
      },
      setToken: (token) => {
        set({ token })
      },
      setHasRefresh: (value) => {
        set({ hasRefresh: value })
      },
      setHydrated: (hydrated) => {
        set({ hydrated })
      },
      register: async (data) => {
        await api.post('/register', data)
      },
      login: async (data) => {
        const res = await api.post<{ user: User; token: string }>('/login', data)
        set({ token: res.data.token, user: res.data.user, hasRefresh: true })
        return res.data
      },
      refresh: async () => {
        try {
          const res = await api.post<{ user: User; token: string }>('/refresh', {})
          set({ token: res.data.token, user: res.data.user, hasRefresh: true })
          return res.data
        } catch (e: any) {
          // 401 is expected when no refresh cookie exists; keep it quiet
          const status = e?.response?.status
          if (status === 401) {
            set({ hasRefresh: false })
            return
          }
          if (status) console.log(e)
        }
      },
      logout: async () => {
        await api.post('/logout', {})
        set({ user: null, token: null, hasRefresh: false })
      }
    }),
    {
      name: 'trippple-auth',
      partialize: (state) => ({ user: state.user, token: state.token, hasRefresh: state.hasRefresh }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      }
    }
  )
)
