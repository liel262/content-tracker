'use client'
import { useState } from 'react'
import { ExternalLink, Pencil, Trash2, MessageSquare, Link2, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { Post, PostStatus, STATUS_LABELS, STATUS_BADGE, STATUS_DOT, ALL_STATUSES } from '@/types'
import { NotesModal } from './NotesModal'
import { DeleteDialog } from './DeleteDialog'

// ─── Status Select (native select overlaid on badge) ─────────────────────────

interface StatusSelectProps {
  post: Post
  onSelect: (s: PostStatus) => void
  mobile?: boolean
}

function StatusSelect({ post, onSelect, mobile }: StatusSelectProps) {
  return (
    <div className="relative inline-flex items-center">
      {/* Visible badge */}
      <span
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full font-medium border pointer-events-none',
          mobile ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1.5 text-xs',
          STATUS_BADGE[post.status]
        )}
      >
        <span className={clsx('rounded-full flex-shrink-0', mobile ? 'w-2 h-2' : 'w-1.5 h-1.5', STATUS_DOT[post.status])} />
        {STATUS_LABELS[post.status]}
        <ChevronDown size={mobile ? 12 : 10} />
      </span>

      {/* Transparent native select — sits on top of the badge */}
      <select
        value={post.status}
        onChange={(e) => onSelect(e.target.value as PostStatus)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        aria-label="שנה סטטוס"
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Link Cell ────────────────────────────────────────────────────────────────

interface LinkCellProps {
  post: Post
  editing: boolean
  linkValue: string
  onEditStart: () => void
  onEditChange: (v: string) => void
  onEditSave: () => void
  onEditCancel: () => void
  mobile?: boolean
}

function LinkCell({ post, editing, linkValue, onEditStart, onEditChange, onEditSave, onEditCancel, mobile }: LinkCellProps) {
  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="url"
          value={linkValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEditSave()
            if (e.key === 'Escape') onEditCancel()
          }}
          onBlur={onEditSave}
          placeholder="https://canva.com/..."
          className={clsx(
            'flex-1 px-3 py-1.5 border border-blue-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 bg-white',
            mobile ? 'text-sm' : 'text-xs'
          )}
        />
      </div>
    )
  }

  if (post.link) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            'flex items-center gap-1 text-blue-600 hover:underline font-medium',
            mobile ? 'text-sm px-3 py-2 bg-blue-50 rounded-xl' : 'text-xs'
          )}
        >
          <ExternalLink size={mobile ? 14 : 12} />
          {mobile ? 'פתח ב-Canva' : 'פתח'}
        </a>
        <button
          onClick={onEditStart}
          className={clsx(
            'text-gray-400 hover:text-gray-600 transition-colors p-1',
            !mobile && 'opacity-0 group-hover:opacity-100'
          )}
          aria-label="ערוך קישור"
        >
          <Pencil size={mobile ? 16 : 12} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={onEditStart}
      className={clsx(
        'flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors',
        mobile ? 'text-sm' : 'text-xs'
      )}
    >
      <Link2 size={mobile ? 14 : 12} />
      הוסף קישור
    </button>
  )
}

// ─── Main Table Component ─────────────────────────────────────────────────────

interface Props {
  posts: Post[]
  loading: boolean
  onUpdateStatus: (id: string, status: PostStatus) => Promise<void>
  onUpdateLink: (id: string, link: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function PostsTable({ posts, loading, onUpdateStatus, onUpdateLink, onDelete }: Props) {
  const [notesPostId, setNotesPostId] = useState<string | null>(null)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [linkValues, setLinkValues] = useState<Record<string, string>>({})

  const notesPost = posts.find((p) => p.id === notesPostId)
  const deletePost = posts.find((p) => p.id === deletePostId)

  function startEditLink(post: Post) {
    setEditingLinkId(post.id)
    setLinkValues((prev) => ({ ...prev, [post.id]: post.link }))
  }

  async function saveLink(post: Post) {
    const newLink = (linkValues[post.id] ?? post.link).trim()
    await onUpdateLink(post.id, newLink)
    setEditingLinkId(null)
  }

// ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Empty ──
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-2xl mb-2">📭</p>
        <p className="font-medium">אין פוסטים להצגה</p>
      </div>
    )
  }

  // ── Desktop Table ──
  const desktopTable = (
    <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 w-10">#</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">שם הפוסט</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 w-48">סטטוס</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 w-56">קישור Canva</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 w-24">הערות</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 w-16">מחיקה</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, idx) => (
            <tr
              key={post.id}
              className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors group"
            >
              {/* # */}
              <td className="py-3 px-4 text-gray-300 text-xs">{idx + 1}</td>

              {/* Name */}
              <td className="py-3 px-4 font-medium text-gray-900">{post.name}</td>

              {/* Status */}
              <td className="py-3 px-4">
                <StatusSelect
                  post={post}
                  onSelect={(s) => onUpdateStatus(post.id, s)}
                />
              </td>

              {/* Link */}
              <td className="py-3 px-4">
                <LinkCell
                  post={post}
                  editing={editingLinkId === post.id}
                  linkValue={linkValues[post.id] ?? ''}
                  onEditStart={() => startEditLink(post)}
                  onEditChange={(v) =>
                    setLinkValues((prev) => ({ ...prev, [post.id]: v }))
                  }
                  onEditSave={() => saveLink(post)}
                  onEditCancel={() => setEditingLinkId(null)}
                />
              </td>

              {/* Notes */}
              <td className="py-3 px-4">
                <button
                  onClick={() => setNotesPostId(post.id)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label={`הערות עבור ${post.name}`}
                >
                  <MessageSquare size={15} />
                  <span>הערות</span>
                </button>
              </td>

              {/* Delete */}
              <td className="py-3 px-4">
                <button
                  onClick={() => setDeletePostId(post.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`מחק את ${post.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ── Mobile Cards ──
  const mobileCards = (
    <div className="md:hidden space-y-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          {/* Card header */}
          <div className="flex items-start justify-between gap-3 p-4 pb-3">
            <h3 className="font-semibold text-gray-900 text-base leading-snug flex-1">
              {post.name}
            </h3>
            <button
              onClick={() => setDeletePostId(post.id)}
              className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1 -mt-0.5"
              aria-label={`מחק את ${post.name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Status */}
          <div className="px-4 pb-3">
            <StatusSelect
              post={post}
              onSelect={(s) => onUpdateStatus(post.id, s)}
              mobile
            />
          </div>

          {/* Link */}
          <div className="px-4 pb-3">
            <LinkCell
              post={post}
              editing={editingLinkId === post.id}
              linkValue={linkValues[post.id] ?? ''}
              onEditStart={() => startEditLink(post)}
              onEditChange={(v) =>
                setLinkValues((prev) => ({ ...prev, [post.id]: v }))
              }
              onEditSave={() => saveLink(post)}
              onEditCancel={() => setEditingLinkId(null)}
              mobile
            />
          </div>

          {/* Notes button */}
          <div className="border-t border-gray-100 px-4 py-3">
            <button
              onClick={() => setNotesPostId(post.id)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              aria-label={`הערות עבור ${post.name}`}
            >
              <MessageSquare size={16} />
              <span>הערות</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {desktopTable}
      {mobileCards}

      {/* Modals */}
      {notesPost && (
        <NotesModal post={notesPost} onClose={() => setNotesPostId(null)} />
      )}
      {deletePost && (
        <DeleteDialog
          postName={deletePost.name}
          onConfirm={async () => {
            await onDelete(deletePost.id)
            setDeletePostId(null)
          }}
          onCancel={() => setDeletePostId(null)}
        />
      )}
    </>
  )
}
