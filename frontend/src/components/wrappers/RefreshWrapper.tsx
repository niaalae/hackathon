import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function RefreshWrapper() {
  const { refresh, token, user, hydrated, hasRefresh } = useAuthStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    if (!token && !user) {
      setReady(true)
      return
    }
    if (!hasRefresh) {
      setReady(true)
      return
    }

    ;(async () => {
      await refresh()
      setReady(true)
    })()
  }, [hydrated, token, user, hasRefresh, refresh])

  return ready && <Outlet />
}
