'use client'
import { PostStats } from '@/types'

interface Card {
  key: keyof PostStats
  label: string
  bg: string
  text: string
  num: string
}

const CARDS: Card[] = [
  { key: 'total',            label: 'סה"כ פוסטים',  bg: 'bg-blue-50   border-blue-100',   text: 'text-blue-600',   num: 'text-blue-800'   },
  { key: 'missing',          label: 'חסר תוכן',      bg: 'bg-red-50    border-red-100',    text: 'text-red-600',    num: 'text-red-800'    },
  { key: 'in_progress',      label: 'בתהליך',        bg: 'bg-amber-50  border-amber-100',  text: 'text-amber-600',  num: 'text-amber-800'  },
  { key: 'pending_approval', label: 'ממתין לאישור',  bg: 'bg-purple-50 border-purple-100', text: 'text-purple-600', num: 'text-purple-800' },
  { key: 'approved',         label: 'אושר',          bg: 'bg-teal-50   border-teal-100',   text: 'text-teal-600',   num: 'text-teal-800'   },
  { key: 'published',        label: 'פורסם',         bg: 'bg-green-50  border-green-100',  text: 'text-green-600',  num: 'text-green-800'  },
]

export function StatsCards({ stats }: { stats: PostStats }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className={`border rounded-2xl p-3 md:p-4 ${card.bg}`}
        >
          <div className={`text-2xl md:text-3xl font-bold ${card.num}`}>
            {stats[card.key]}
          </div>
          <div className={`text-xs md:text-sm mt-1 font-medium leading-tight ${card.text}`}>
            {card.label}
          </div>
        </div>
      ))}
    </div>
  )
}
