'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Clock, AlertCircle, Bell, Wifi } from 'lucide-react'
import { useNotifications } from '@/context/NotificationContext'
import clsx from 'clsx'

const NAV_ITEMS = [
  { href: '/', label: 'כל הפוסטים', icon: LayoutDashboard },
  { href: '/pending', label: 'ממתין לאישור', icon: Clock, badge: true },
  { href: '/missing', label: 'חסר תוכן', icon: AlertCircle },
]

export function Navigation() {
  const pathname = usePathname()
  const { unreadCount, clearUnread, notificationPermission, requestPermission } =
    useNotifications()

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-white border-l border-gray-200 h-full">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              C
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">Content Tracker</h1>
              <p className="text-xs text-gray-400 mt-0.5">ניהול תוכן</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href
            const showBadge = badge && unreadCount > 0
            return (
              <Link
                key={href}
                href={href}
                onClick={() => badge && clearUnread()}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
                {showBadge && (
                  <span className="bg-purple-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          {/* Realtime indicator */}
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400">
            <Wifi size={13} className="text-green-500" />
            <span>סנכרון בזמן אמת פעיל</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-auto" />
          </div>

          {/* Notification permission button */}
          {notificationPermission !== 'granted' && (
            <button
              onClick={requestPermission}
              aria-label="אפשר התראות דפדפן"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-colors"
            >
              <Bell size={15} />
              <span>אפשר התראות</span>
            </button>
          )}
        </div>
      </aside>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
        <div className="flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href
            const showBadge = badge && unreadCount > 0
            return (
              <Link
                key={href}
                href={href}
                onClick={() => badge && clearUnread()}
                className={clsx(
                  'flex-1 flex flex-col items-center gap-1 py-2.5 px-1 text-xs font-medium transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-400'
                )}
              >
                <div className="relative">
                  <Icon size={23} />
                  {showBadge && (
                    <span className="absolute -top-1.5 -left-1.5 bg-purple-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-0.5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="leading-none">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
