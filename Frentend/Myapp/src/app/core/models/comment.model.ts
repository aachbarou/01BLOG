export interface Comment {
    id: string;
    postId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: Date;
    user: {
        role : string;
        user_id: number; 
        username: string;
        userAvatar : string;
        email: string;
    };
}