import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function AdminWrapper() {
  const { user } = useAuthStore()
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    !user?.admin && navigate('/')
    setReady(true)
  }, [])

  return ready && <Outlet />
}
