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

export type ParticipantStatusFilter = "" | "true" | "false";

export interface ParticipantFilters {
    search?: string;
    isActive?: boolean;
}

export interface ParticipantFormValues {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string | null;
    isActive: boolean;
}

export interface CreateParticipantRequest {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string | null;
}

export type UpdateParticipantRequest = ParticipantFormValues;