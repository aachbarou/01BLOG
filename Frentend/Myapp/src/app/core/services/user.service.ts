export interface UserAuthor {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface UserProfile extends UserAuthor {
  bio: string;
  joinDate: Date;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}
