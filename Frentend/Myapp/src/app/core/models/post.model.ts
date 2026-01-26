export interface Post {
    id: number;
    title: string;
    content: string; // Note: 'Content' in Java, but likely serialized to 'content'
    mediaUrl?: string; // Corresponds to mediaUrl in Java
    timestamp: string; // LocalDateTime is typically serialized as a string
    user?: {
        user_id: number;
        username: string;
        email: string;
        role: string;
        status: string;
        userAvatar: string;
    };
    likes?: number;
    comments?: number;
}