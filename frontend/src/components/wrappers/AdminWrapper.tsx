import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function AdminWrapper() {
  const { user } = useAuthStore()
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/')
    }
    setReady(true)
  }, [user, navigate])

  return ready && <Outlet />
}
