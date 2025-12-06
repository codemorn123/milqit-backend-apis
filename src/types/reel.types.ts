export interface IReel {
    _id: string;
    title: string;
    description?: string;
    videoUrl: string;
    videoKey?: string;
    thumbnailUrl?: string;
    thumbnailKey?: string;
    likes: number;
    likedBy: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReelResponse {
    _id: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    likes: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isLiked?: boolean;
}
