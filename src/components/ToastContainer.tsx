'use client'
import { X, MessageSquare } from 'lucide-react'
import { useNotifications } from '@/context/NotificationContext'

export function ToastContainer() {
  const { toasts, removeToast } = useNotifications()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-4 z-[100] space-y-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4
                     flex gap-3 items-start animate-slide-in"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={16} className="text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">
              💬 הערה חדשה מ-{toast.author}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
              {toast.content}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-300 hover:text-gray-500 flex-shrink-0 transition-colors"
            aria-label="סגור התראה"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
