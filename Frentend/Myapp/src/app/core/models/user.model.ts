import { Post } from "./post.model";

export  interface UserProfile {
    id: number;
    name: string;
    avatarUrl: string;
    bio: string;
    stats: {
        posts: Post[];
        followers: number;
        following: number;
    }; 
}
export interface UserLogin {
    email: string;
    password: string;
}

export  interface UserRegister {
        username: string;
        email: string;
        password: string; 
        confirmPassword: string;
}
