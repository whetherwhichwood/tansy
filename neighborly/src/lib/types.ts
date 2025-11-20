import { PostCategory, PostStatus } from '@prisma/client'

export type { PostCategory, PostStatus }

export interface Resident {
  id: string
  hoaId: string
  email: string
  name: string
  address: string
  verificationCode?: string | null
  isVerified: boolean
  reputationScore: number
  badges: Record<string, number>
  avatar?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  authorId: string
  hoaId: string
  title: string
  description: string
  category: PostCategory
  status: PostStatus
  claimedById?: string | null
  createdAt: Date
  completedAt?: Date | null
  author: Resident
  claimer?: Resident | null
}

export interface Message {
  id: string
  postId: string
  senderId: string
  content: string
  createdAt: Date
  sender: Resident
}

export interface Feedback {
  id: string
  postId: string
  fromResidentId: string
  toResidentId: string
  badges: string[]
  comment?: string | null
  createdAt: Date
  fromResident: Resident
  toResident: Resident
}

export interface Announcement {
  id: string
  hoaId: string
  title: string
  content: string
  isPinned: boolean
  createdAt: Date
}

export interface HOA {
  id: string
  name: string
  address: string
  inviteCode: string
  createdAt: Date
  updatedAt: Date
}

export type CreatePostData = {
  title: string
  description: string
  category: PostCategory
}

export type CreateMessageData = {
  content: string
}

export type CreateFeedbackData = {
  badges: string[]
  comment?: string
}

export type SignupData = {
  name: string
  email: string
  address: string
  inviteCode: string
}








