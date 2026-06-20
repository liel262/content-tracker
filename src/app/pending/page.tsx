'use client'
import { useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { PostsTable } from '@/components/PostsTable'
import { SearchBar } from '@/components/SearchBar'

export default function PendingPage() {
  const [search, setSearch] = useState('')
  const { posts, loading, updateStatus, updateLink, deletePost } = usePosts('pending_approval')

  const filtered = search
    ? posts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : posts

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ממתין לאישור</h1>
        <p className="text-gray-500 mt-1 text-sm">פוסטים הממתינים לאישור יניב</p>
      </div>

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-semibold text-lg text-gray-600">אין פוסטים ממתינים</p>
          <p className="text-sm mt-1">הכל מטופל!</p>
        </div>
      )}

      {(loading || posts.length > 0) && (
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} />
          <PostsTable
            posts={filtered}
            loading={loading}
            onUpdateStatus={updateStatus}
            onUpdateLink={updateLink}
            onDelete={deletePost}
          />
          {!loading && (
            <p className="text-xs text-gray-400 text-center py-2">
              💡 שנה סטטוס ל&quot;אושר&quot; לאחר הבדיקה
            </p>
          )}
        </div>
      )}
    </div>
  )
}
