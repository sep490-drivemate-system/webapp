// Post Status Enum
export enum PostStatus {
  PENDING_REVIEW = "PENDING_REVIEW",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
  DRAFT = "DRAFT",
}

// Moderation Status Enum
export enum ModerationStatus {
  WAITING = "WAITING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUGGEST_EDIT = "SUGGEST_EDIT",
}

// Reaction Type Enum
export enum ReactionType {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}

// User Role Enum
export enum UserRole {
  INSTRUCTOR = "INSTRUCTOR",
  INSPECTOR = "INSPECTOR",
  NOVICE_DRIVER = "NOVICE_DRIVER",
  ADMIN = "ADMIN",
}

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

// Post Interface
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  thumbnail: string;
  galleryImages?: string[];
  videoUrl?: string;
  category: string;
  tags: string[];
  author: User;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  readTime?: number;
  views: number;
  likes: number;
  dislikes: number;
  featured?: boolean;
}

// Post Moderation Interface
export interface PostModeration {
  id: string;
  postId: string;
  inspectorId: string;
  inspector: User;
  status: ModerationStatus;
  reviewNote?: string;
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt: string;
}

// Comment Interface
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  parentId?: string; // For nested replies
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
}

// Reaction Interface
export interface Reaction {
  id: string;
  postId?: string;
  commentId?: string;
  userId: string;
  user: User;
  type: ReactionType;
  createdAt: string;
}

// Post with Moderation
export interface PostWithModeration extends Post {
  moderation?: PostModeration;
}

// Post with Comments and Reactions
export interface PostDetail extends Post {
  comments: Comment[];
  reactions: Reaction[];
  moderation?: PostModeration;
  userReaction?: ReactionType;
}

