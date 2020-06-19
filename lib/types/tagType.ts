export interface TagList {
  tags: string[];
}

export interface Tag {
  tag: TagType;
}

export type TagType = {
  tagname: string;
  slug: string;
  description: string;
  icon: string;
  modSetting: number;
  following: boolean;
  moderators: User[];
  tagFollowers: User[];
};

export type User = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};