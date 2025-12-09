import { User, UserRole } from "./post.type";

export interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  views: number;
  upvotes: number;
  downvotes: number;
  isSolved: boolean;
  tags: string[];
  acceptedAnswerId?: string;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  isInstructorAnswer: boolean;
}

