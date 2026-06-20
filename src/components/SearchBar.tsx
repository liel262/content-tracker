'use client'
import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="חיפוש פוסטים..."
        className="w-full pr-10 pl-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
                   placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-100
                   focus:border-blue-300 shadow-sm transition-shadow"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="נקה חיפוש"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
