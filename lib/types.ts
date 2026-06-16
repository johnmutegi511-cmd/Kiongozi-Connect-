// User Types
export type UserRole = 'citizen' | 'leader' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  display_name: string
  bio: string
  avatar_url: string
  cover_image_url: string
  created_at: string
  updated_at: string
}

export interface Leader {
  id: string
  user_id: string
  position: string
  ward: string
  constituency: string
  verified: boolean
  followers_count: number
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  media_urls: string[]
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  leader_id: string
  title: string
  description: string
  status: 'planned' | 'ongoing' | 'completed'
  budget: number
  media_urls: string[]
  created_at: string
  updated_at: string
}

export interface ProjectUpdate {
  id: string
  project_id: string
  title: string
  description: string
  media_urls: string[]
  update_type: 'daily' | 'weekly' | 'monthly'
  created_at: string
}

export interface Meeting {
  id: string
  leader_id: string
  title: string
  description: string
  venue: string
  date_time: string
  rsvp_count: number
  created_at: string
}

export interface Group {
  id: string
  name: string
  description: string
  group_type: 'ward' | 'youth' | 'farmer' | 'business' | 'community'
  members_count: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  message: string
  related_id: string
  read: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: 'basic' | 'standard' | 'premium'
  price: number
  status: 'active' | 'cancelled' | 'expired'
  starts_at: string
  ends_at: string
}
