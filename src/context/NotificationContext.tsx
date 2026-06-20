'use client'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import { Note } from '@/types'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OneSignalDeferred?: ((onesignal: any) => Promise<void>)[]
  }
}

export interface Toast {
  id: string
  author: string
  content: string
}

interface NotificationContextType {
  toasts: Toast[]
  removeToast: (id: string) => void
  unreadCount: number
  clearUnread: () => void
  notificationPermission: NotificationPermission | null
  requestPermission: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | null>(null)
  // Ignore events that fire within the first second of subscription (prevent
  // Supabase from replaying buffered events as "new")
  const isReady = useRef(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    const timer = setTimeout(() => {
      isReady.current = true
    }, 1500)

    const channel = supabase
      .channel('global-notes-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notes' },
        (payload) => {
          if (!isReady.current) return
          const note = payload.new as Note
          const id = `${Date.now()}-${Math.random()}`

          setToasts((prev) => [...prev, { id, author: note.author, content: note.content }])
          setUnreadCount((prev) => prev + 1)

          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
          }, 6000)

          if (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            new Notification(`💬 הערה חדשה מ-${note.author}`, {
              body: note.content.slice(0, 100),
              icon: '/favicon.ico',
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      clearTimeout(timer)
    }
  }, [])

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function clearUnread() {
    setUnreadCount(0)
  }

  async function requestPermission() {
    if (typeof window === 'undefined') return

    // 1. Standard browser permission (used for in-app toasts check)
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }

    // 2. OneSignal subscription (push when app is closed / phone locked)
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async (OneSignal) => {
        await OneSignal.Notifications.requestPermission()
      })
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        removeToast,
        unreadCount,
        clearUnread,
        notificationPermission,
        requestPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
