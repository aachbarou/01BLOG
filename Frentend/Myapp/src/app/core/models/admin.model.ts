export interface AdminUser {
    user_id: number;
    username: string;
    email: string;
    role: string;
    banned: boolean;
    userAvatar: string;
}

export interface AdminPost {
    id: number;
    title: string;
    content: string;
    mediaUrl?: string;
    status: string;
    user: {
        user_id: number;
        username: string;
        userAvatar: string;
    };
}

export interface Report {
    id: number;
    type: string;
    reason: string;
    reporter: string;
    targetId: number;
    timestamp: string;
    status: string;
}
