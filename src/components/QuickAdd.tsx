'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'

interface Props {
  onAdd: (name: string) => Promise<void>
}

export function QuickAdd({ onAdd }: Props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return
    setLoading(true)
    await onAdd(trimmed)
    setValue('')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="הוסף רעיון לפוסט..."
        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm
                   placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-100
                   focus:border-blue-300 shadow-sm transition-shadow"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={!value.trim() || loading}
        className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl
                   font-medium text-sm hover:bg-blue-700 disabled:opacity-40
                   disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <Plus size={18} />
        <span className="hidden sm:inline">הוסף</span>
      </button>
    </form>
  )
}
