import axios from 'axios'
import api from './api'

export const requestHeroAgent = async <T>(
  prompt: string,
  history?: { role: 'user' | 'assistant'; content: string }[],
) => {
  try {
    return await api.post<T>('/agent/hero', { prompt, history })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 400 || status === 415) {
        return await api.get<T>('/agent/hero', { params: { prompt } })
      }
    }
    throw error
  }
}
