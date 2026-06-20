'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Post, PostStatus, PostStats } from '@/types'

export function usePosts(filterStatus?: PostStatus) {
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const channelId = useRef(`posts-${Date.now()}-${Math.random()}`)

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel(channelId.current)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => { fetchPosts() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setAllPosts(data as Post[])
    setLoading(false)
  }

  async function addPost(name: string) {
    await supabase.from('posts').insert({ name, status: 'missing', link: '' })
  }

  async function updateStatus(id: string, status: PostStatus) {
    const { error } = await supabase
      .from('posts')
      .update({ status })
      .eq('id', id)
    if (error) console.error('updateStatus error:', error)
    else fetchPosts()
  }

  async function updateLink(id: string, link: string) {
    const { error } = await supabase
      .from('posts')
      .update({ link })
      .eq('id', id)
    if (error) console.error('updateLink error:', error)
    else fetchPosts()
  }

  async function deletePost(id: string) {
    await supabase.from('posts').delete().eq('id', id)
  }

  const posts = filterStatus
    ? allPosts.filter((p) => p.status === filterStatus)
    : allPosts

  const stats: PostStats = {
    total: allPosts.length,
    missing: allPosts.filter((p) => p.status === 'missing').length,
    in_progress: allPosts.filter((p) => p.status === 'in_progress').length,
    pending_approval: allPosts.filter((p) => p.status === 'pending_approval').length,
    approved: allPosts.filter((p) => p.status === 'approved').length,
    published: allPosts.filter((p) => p.status === 'published').length,
  }

  return { posts, loading, stats, addPost, updateStatus, updateLink, deletePost }
}
