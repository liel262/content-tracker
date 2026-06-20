'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Note } from '@/types'

export function useNotes(postId: string | null) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const channelId = useRef(`notes-${Date.now()}-${Math.random()}`)

  useEffect(() => {
    if (!postId) return
    fetchNotes()

    const channel = supabase
      .channel(channelId.current)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `post_id=eq.${postId}`,
        },
        () => { fetchNotes() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  async function fetchNotes() {
    if (!postId) return
    setLoading(true)
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (data) setNotes(data as Note[])
    setLoading(false)
  }

  async function addNote(content: string, author: string) {
    if (!postId) return
    const { error } = await supabase
      .from('notes')
      .insert({ post_id: postId, content, author })

    // Send push notification to all OneSignal subscribers (fire-and-forget)
    if (!error) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      }).catch(() => {})
    }
  }

  async function deleteNote(id: string) {
    await supabase.from('notes').delete().eq('id', id)
  }

  return { notes, loading, addNote, deleteNote }
}
