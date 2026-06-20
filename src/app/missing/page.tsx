'use client'
import { useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { PostsTable } from '@/components/PostsTable'
import { SearchBar } from '@/components/SearchBar'

export default function MissingPage() {
  const [search, setSearch] = useState('')
  const { posts, loading, updateStatus, updateLink, deletePost } = usePosts('missing')

  const filtered = search
    ? posts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : posts

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">חסר תוכן</h1>
        <p className="text-gray-500 mt-1 text-sm">פוסטים שעדיין לא נכתב להם תוכן</p>
      </div>

      {/* All good state */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-3">🎉</p>
          <p className="text-xl font-bold text-gray-800">כל הכבוד!</p>
          <p className="text-gray-500 mt-2">אין פוסטים חסרי תוכן</p>
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
        </div>
      )}
    </div>
  )
}
