'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Trash2, Send } from 'lucide-react'
import { useNotes } from '@/hooks/useNotes'
import { Post } from '@/types'
import clsx from 'clsx'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-rose-500',
]

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length
  return AVATAR_COLORS[hash]
}

function formatTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMin = Math.floor((now - then) / 60_000)
  if (diffMin < 1) return 'עכשיו'
  if (diffMin < 60) return `לפני ${diffMin} דק'`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `לפני ${diffHrs} שע'`
  return new Date(iso).toLocaleString('he-IL', {
    day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function getStoredAuthor(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('ct-author') ?? ''
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  post: Post
  onClose: () => void
}

export function NotesModal({ post, onClose }: Props) {
  const { notes, loading, addNote, deleteNote } = useNotes(post.id)
  const [author, setAuthor] = useState(getStoredAuthor)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when notes load/update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [notes])

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Persist author name
  function handleAuthorChange(name: string) {
    setAuthor(name)
    if (typeof window !== 'undefined') localStorage.setItem('ct-author', name)
  }

  async function handleSend() {
    if (!content.trim() || !author.trim() || sending) return
    setSending(true)
    await addNote(content.trim(), author.trim())
    setContent('')
    setSending(false)
    contentRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full md:max-w-lg bg-white md:rounded-2xl rounded-t-3xl
                   shadow-2xl flex flex-col animate-fade-in"
        style={{ maxHeight: '88vh' }}
      >
        {/* Handle bar (mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">הערות</h2>
            <p className="text-sm text-gray-500 mt-0.5 truncate max-w-[260px]">{post.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="סגור"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && notes.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">💬</p>
              <p className="font-medium">אין הערות עדיין</p>
              <p className="text-sm mt-1">היה הראשון להגיב!</p>
            </div>
          )}

          {notes.map((note) => (
            <div key={note.id} className="flex gap-3 group">
              {/* Avatar */}
              <div
                className={clsx(
                  'w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 select-none',
                  avatarColor(note.author)
                )}
              >
                {note.author.charAt(0).toUpperCase()}
              </div>

              {/* Bubble */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-sm text-gray-900">{note.author}</span>
                  <span className="text-xs text-gray-400">{formatTime(note.created_at)}</span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="mr-auto text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label="מחק הערה"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-gray-700 leading-relaxed">
                  {note.content}
                </div>
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 p-4 space-y-2.5">
          <input
            type="text"
            value={author}
            onChange={(e) => handleAuthorChange(e.target.value)}
            placeholder="שמך..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                       placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-100
                       focus:border-blue-300 transition-shadow"
          />
          <div className="flex gap-2">
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="כתוב הערה..."
              rows={2}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                         placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-100
                         focus:border-blue-300 resize-none transition-shadow leading-relaxed"
            />
            <button
              onClick={handleSend}
              disabled={!content.trim() || !author.trim() || sending}
              className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors
                         flex items-center justify-center"
              aria-label="שלח הערה"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">Cmd+Enter לשליחה מהירה</p>
        </div>
      </div>
    </div>
  )
}
