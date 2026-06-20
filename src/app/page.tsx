'use client'
import { useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { StatsCards } from '@/components/StatsCards'
import { QuickAdd } from '@/components/QuickAdd'
import { PostsTable } from '@/components/PostsTable'
import { SearchBar } from '@/components/SearchBar'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const { posts, loading, stats, addPost, updateStatus, updateLink, deletePost } = usePosts()

  const filtered = search
    ? posts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : posts

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">כל הפוסטים</h1>
        <p className="text-gray-500 mt-1 text-sm">ניהול תוכן לסושיאל מדיה</p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <QuickAdd onAdd={addPost} />
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Table */}
      <div className="mt-4">
        <PostsTable
          posts={filtered}
          loading={loading}
          onUpdateStatus={updateStatus}
          onUpdateLink={updateLink}
          onDelete={deletePost}
        />
      </div>
    </div>
  )
}
