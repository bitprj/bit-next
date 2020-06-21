export interface Comments {
  comments: CommentType[];
}

export type CommentType = {
  createdAt: number;
  id: string;
  body: string;
  slug: string;
  author: Author;
  updatedAt: number;
  parentComment: CommentChildren;
};

export type Author = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export type CommentChildren = {
  comments: CommentType[];
}