import { PostStatus, ReactionType } from "./post.enum";

export interface IPostCreation {
  title: string;
  content: string;
  images?: File[];
  imageOrders?: number[];
  videos?: File[];
  videoOrders?: number[];
  tagIds: string[];
  categoryIds: string[];
}


export interface IPostUpdate {
  reasion?: string;
  status?: PostStatus;
}
export interface IPostReject {
  postId: string;
  reason: string;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  images?: File[];
  imageOrders?: number[];
  videos?: File[];
  videoOrders?: number[];
}



export interface IPostReaction {
  type: ReactionType;

}

export interface ICommentCreation {
  UserId: string;
  content: string;
  parentCommentId?: string;
}

export interface Comment {
  commentId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  parentCommentId: string | null;
  createdAt: string;
}

export interface Reaction {
  userId: string;
  userName: string;
  userAvatar: string;
  type: ReactionType;
  createdAt: string;
}

export interface PostsDTO {
  postId: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  images: Image[];
  videos: Video[];
  status: PostStatus;
  createdAt: string;
  lastModifiedAt: string;
  likeCount?: number;
  comments?: Comment[];
  reactions?: Reaction[];
}

export interface Image {
  url: string;
  order?: number | null;
}

export interface Video {
  url: string;
  order: number;
}



