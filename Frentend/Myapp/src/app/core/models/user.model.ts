export  interface UserProfile {
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
export interface UserAuth {
    name: string;
    email: string;
    password: string;
}

export  interface UserRegister {
        username: string;
        email: string;
        password: string; 
        confirmPassword: string;
}
