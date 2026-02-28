export interface Comment {
    id: string;
    postId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
    user: {
        role: string;
        user_id: number;
        username: string;
        userAvatar: string;
        email: string;
    };
}