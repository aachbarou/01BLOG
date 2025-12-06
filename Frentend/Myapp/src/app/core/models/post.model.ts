export interface Post {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    imageUrl?: string;
    date: Date;
    likes: number;
    comments: number;
}