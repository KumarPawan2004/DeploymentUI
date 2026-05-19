export interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'User' | 'Admin';
    isBlocked: boolean;
}

export interface Note {
    id: string;
    title: string;
    description: string;
    subject: string;
    category: string;
    price: number;
    filePath: string;
    uploadedBy: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    isPublished: boolean;
    uploadedAt: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export type NoteStatus = 'Pending' | 'Approved' | 'Rejected';