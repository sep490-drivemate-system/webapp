import { UserRole } from "../auth/user-role.enum";

export enum PostStatus {
  PENDING_REVIEW = "PENDING_REVIEW",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
  DRAFT = "DRAFT",
}

export enum ModerationStatus {
  WAITING = "WAITING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUGGEST_EDIT = "SUGGEST_EDIT",
}

export enum ReactionType {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

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

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
}

export interface Reaction {
  id: string;
  postId?: string;
  commentId?: string;
  userId: string;
  user: User;
  type: ReactionType;
  createdAt: string;
}

export interface PostWithModeration extends Post {
  moderation?: PostModeration;
}

export interface PostDetail extends Post {
  comments: Comment[];
  reactions: Reaction[];
  moderation?: PostModeration;
  userReaction?: ReactionType;
}

