import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function UserWrapper() {
  const { user, hydrated } = useAuthStore()
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (!hydrated) return
    !user && navigate('/')
    setReady(true)
  }, [hydrated, user, navigate])
  return ready && <Outlet />
}
