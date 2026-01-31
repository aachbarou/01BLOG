export interface Post {
    id: number;
    title: string;
    content: string; 
    mediaUrl?: string; 
    timestamp: string; 
    user?: {
        user_id: number;
        username: string;
        email: string;
        role: string;
        status: string;
        userAvatar: string;
    };
    liked?: boolean;
    likes?: number;
    comments?: number;
}