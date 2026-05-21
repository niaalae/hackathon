import axios from 'axios'

const FALLBACK_PRODUCTION_API_URL = 'https://hackathon-bck-production.up.railway.app/api'

function resolveApiBaseUrl() {
  const envBaseUrl = import.meta.env.VITE_PUBLIC_API_URL?.trim()

  if (envBaseUrl) return envBaseUrl.replace(/\/+$/, '')

  if (typeof window !== 'undefined') {
    const isLocalFrontend = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    return isLocalFrontend ? '/api' : FALLBACK_PRODUCTION_API_URL
  }

  return FALLBACK_PRODUCTION_API_URL
}

const baseURL = resolveApiBaseUrl()

const api = axios.create({
  baseURL,
  withCredentials: true
})

export default api
