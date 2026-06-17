import { supabase } from '@/lib/supabase'
import type { User, Post, Leader } from '@/lib/types'

const ITEMS_PER_PAGE = 20

// Users
export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, created_at, updated_at')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }
  return data
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, created_at, updated_at')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
  return data
}

// Leaders
export async function getLeaders(
  page: number = 1,
  verified: boolean | null = null
) {
  let query = supabase
    .from('leaders')
    .select('id, user_id, position, ward, constituency, verified, followers_count, created_at, updated_at', {
      count: 'exact',
    })

  if (verified !== null) {
    query = query.eq('verified', verified)
  }

  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error, count } = await query
    .order('followers_count', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching leaders:', error)
    return { leaders: [], total: 0 }
  }

  return { leaders: data || [], total: count || 0 }
}

export async function getLeader(leaderId: string): Promise<Leader | null> {
  const { data, error } = await supabase
    .from('leaders')
    .select('id, user_id, position, ward, constituency, verified, followers_count, created_at, updated_at')
    .eq('id', leaderId)
    .single()

  if (error) {
    console.error('Error fetching leader:', error)
    return null
  }
  return data
}

// Posts
export async function getPosts(page: number = 1, userId: string | null = null) {
  let query = supabase
    .from('posts')
    .select('id, user_id, content, media_urls, likes_count, comments_count, shares_count, created_at, updated_at', {
      count: 'exact',
    })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], total: 0 }
  }

  return { posts: data || [], total: count || 0 }
}

export async function getPost(postId: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, user_id, content, media_urls, likes_count, comments_count, shares_count, created_at, updated_at')
    .eq('id', postId)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }
  return data
}

// Projects
export async function getProjects(
  page: number = 1,
  leaderId: string | null = null,
  status: string | null = null
) {
  let query = supabase
    .from('projects')
    .select('id, leader_id, title, description, status, budget, media_urls, created_at, updated_at', {
      count: 'exact',
    })

  if (leaderId) {
    query = query.eq('leader_id', leaderId)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching projects:', error)
    return { projects: [], total: 0 }
  }

  return { projects: data || [], total: count || 0 }
}

// Meetings
export async function getMeetings(
  page: number = 1,
  leaderId: string | null = null,
  upcoming: boolean = true
) {
  let query = supabase
    .from('meetings')
    .select('id, leader_id, title, description, venue, date_time, rsvp_count, created_at', {
      count: 'exact',
    })

  if (leaderId) {
    query = query.eq('leader_id', leaderId)
  }

  if (upcoming) {
    query = query.gte('date_time', new Date().toISOString())
  }

  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error, count } = await query
    .order('date_time', { ascending: upcoming })
    .range(start, end)

  if (error) {
    console.error('Error fetching meetings:', error)
    return { meetings: [], total: 0 }
  }

  return { meetings: data || [], total: count || 0 }
}

// Groups
export async function getGroups(page: number = 1, groupType: string | null = null) {
  let query = supabase
    .from('groups')
    .select('id, name, description, group_type, members_count, created_at', {
      count: 'exact',
    })

  if (groupType) {
    query = query.eq('group_type', groupType)
  }

  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error, count } = await query
    .order('members_count', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching groups:', error)
    return { groups: [], total: 0 }
  }

  return { groups: data || [], total: count || 0 }
}

// Notifications
export async function getNotifications(userId: string, page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error, count } = await supabase
    .from('notifications')
    .select('id, type, message, related_id, read, created_at', {
      count: 'exact',
    })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching notifications:', error)
    return { notifications: [], total: 0 }
  }

  return { notifications: data || [], total: count || 0 }
}
