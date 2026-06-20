export type PostStatus =
  | 'missing'
  | 'in_progress'
  | 'pending_approval'
  | 'approved'
  | 'published'

export interface Post {
  id: string
  name: string
  status: PostStatus
  link: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  post_id: string
  content: string
  author: string
  created_at: string
}

export const STATUS_LABELS: Record<PostStatus, string> = {
  missing: 'חסר תוכן',
  in_progress: 'בתהליך',
  pending_approval: 'ממתין לאישור',
  approved: 'אושר',
  published: 'פורסם',
}

export const STATUS_BADGE: Record<PostStatus, string> = {
  missing: 'bg-red-100 text-red-700 border-red-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  pending_approval: 'bg-purple-100 text-purple-700 border-purple-200',
  approved: 'bg-teal-100 text-teal-700 border-teal-200',
  published: 'bg-green-100 text-green-700 border-green-200',
}

export const STATUS_DOT: Record<PostStatus, string> = {
  missing: 'bg-red-500',
  in_progress: 'bg-amber-500',
  pending_approval: 'bg-purple-500',
  approved: 'bg-teal-500',
  published: 'bg-green-500',
}

export const ALL_STATUSES: PostStatus[] = [
  'missing',
  'in_progress',
  'pending_approval',
  'approved',
  'published',
]

export interface PostStats {
  total: number
  missing: number
  in_progress: number
  pending_approval: number
  approved: number
  published: number
}
