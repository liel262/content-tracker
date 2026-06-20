'use client'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  postName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteDialog({ postName, onConfirm, onCancel }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">מחיקת פוסט</h2>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          האם אתה בטוח שברצונך למחוק את{' '}
          <span className="font-semibold text-gray-900">"{postName}"</span>?
          <br />
          פעולה זו לא ניתנת לביטול.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium
                       hover:bg-gray-200 transition-colors text-sm"
          >
            ביטול
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium
                       hover:bg-red-700 transition-colors text-sm"
          >
            מחק
          </button>
        </div>
      </div>
    </div>
  )
}
