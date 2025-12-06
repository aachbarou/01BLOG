export interface  UserProfile {
    id: string;
    name: string;
    avatarUrl: string;
    bio: string;
    stats: {
        posts: number;
        followers: string;
        following: number;
    };
}