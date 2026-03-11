import axios from 'axios'
import { create } from 'zustand'

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
  id: number
  name: string
  admin: boolean
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
    await axios.post(import.meta.env.VITE_PUBLIC_API_URL + '/register', data, { withCredentials: true })
  },
  login: async (data) => {
    const res = await axios.post<{ user: User; token: string }>(import.meta.env.VITE_PUBLIC_API_URL + '/login', data, { withCredentials: true })
    set({ token: res.data.token, user: res.data.user })
  },
  refresh: async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_PUBLIC_API_URL + '/refresh', {}, { withCredentials: true })
      set({ token: res.data.token, user: res.data.user })
    } catch (e) {
      console.log(e)
    }
  },
  logout: async () => {
    await axios.post(import.meta.env.VITE_PUBLIC_API_URL + '/logout', {}, { withCredentials: true })
    set({ user: null, token: null })
  }
}))
