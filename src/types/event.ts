
export interface Event {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    location: string;
    startAt: string;
    endAt: string;
    capacity: number;
    activeRegistrationCount: number;
    availableSeats: number;
    eventStatus: string;
    isActive: boolean;
}

export interface EventsResponse {
    items: Event[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
export interface CreateEventPayload {
    name: string;
    categoryId: number;
    description: string;
    location: string;
    capacity: number;
    startAt: string;
    endAt: string;
    registrationDeadline: string;
    isActive: boolean;
}

export  interface EventFormData {
    name: string;
    categoryId: string | "";
    description: string;
    location: string;
    capacity: string | "";
    startAt: string;
    endAt: string;
    registrationDeadline: string;
    isActive: string | "";
}
export interface CreateEventResponse  {
    id: number;
    message: string;
}

export interface EventDetails {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    description: string;
    location: string;
    startAt: string;
    endAt: string;
    registrationDeadline: string;
    capacity: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}
export function toIsoDate(value: string): string {
    return new Date(value).toISOString();
}