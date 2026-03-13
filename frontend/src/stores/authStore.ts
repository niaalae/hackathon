import { create } from 'zustand'
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
  setUser: (user: User) => void
  setToken: (token: string) => void
  register: (data: RegisterData) => Promise<void>
  login: (data: LoginData) => Promise<void>
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStoreInterface>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user })
  },
  token: null,
  setToken: (token) => {
    set({ token })
  },
  register: async (data) => {
    await api.post('/register', data)
  },
  login: async (data) => {
    const res = await api.post<{ user: User; token: string }>('/login', data)
    set({ token: res.data.token, user: res.data.user })
  },
  refresh: async () => {
    try {
      const res = await api.post<{ user: User; token: string }>('/refresh', {})
      set({ token: res.data.token, user: res.data.user })
    } catch (e) {
      console.log(e)
    }
  },
  logout: async () => {
    await api.post('/logout', {})
    set({ user: null, token: null })
  }
}))
