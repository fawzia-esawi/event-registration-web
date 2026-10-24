export interface Participant {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface ParticipantsResponse {
    items: Participant[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
export interface ParticipantFilters {
    search?: string;
    isActive?: boolean;
}