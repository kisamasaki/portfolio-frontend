export type SignUpCredential = {
  id: string;
  userName: string;
  password: string;
};

export type LogInCredential = {
  id: string;
  password: string;
};

export type Comic = {
  itemNumber: string;
  title: string;
  author: string;
  itemCaption: string;
  largeImageUrl: string;
  salesDate: string;
};

export type CompletedComic = {
  ID: string;
  rating: number;
  review: string;
  createdAt: string;
  user: User;
  userId: string;
  comic: Comic;
  comicId: string;
};

export type CompletedComicRes = {
  ID: string;
  rating: number;
  review: string;
  comic: Comic;
};

export type User = {
  id: string;
  userName: string;
  imageUrl: string;
  followings: Array<{
    ID: number;
    FollowingID: string;
    FollowerID: string;
  }>;
  followers: Array<{
    ID: number;
    FollowingID: string;
    FollowerID: string;
  }>;
};

export type UserRes = {
  id: string;
  userName: string;
  imageUrl: string;
};
