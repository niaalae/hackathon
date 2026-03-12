import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function UserWrapper() {
  const { user } = useAuthStore()
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    !user && navigate('/')
    setReady(true)
  }, [])
  return ready && <Outlet />
}
