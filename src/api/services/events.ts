
import { apiClient } from "../client.ts";
import {
    type CreateEventPayload,
    type EventsResponse,
    type EventFormData,
    type CreateEventResponse,
    type EventDetails,
    toIsoDate,
} from "../../types/event.ts";

export type EventFilters = {
    search?: string;
    categoryId?: string;
    isActive?: string;
    fromDate?: string;
    toDate?: string;
};

export function getEvents(
    page = 1,
    pageSize = 10,
    filters: EventFilters = {},
): Promise<EventsResponse> {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    if (filters.search?.trim()) {
        params.set("search", filters.search.trim());
    }

    if (filters.categoryId) {
        params.set("categoryId", filters.categoryId);
    }

    if (filters.isActive !== "" && filters.isActive !== undefined) {
        params.set("isActive", filters.isActive);
    }

    if (filters.fromDate) {
        params.set("fromDate", filters.fromDate);
    }

    if (filters.toDate) {
        params.set("toDate", filters.toDate);
    }

    return apiClient.get<EventsResponse>(
        `/events?${params.toString()}`,
    );
}

export function createEvents(
    newEvent: EventFormData,
): Promise<CreateEventResponse> {
    const payload: CreateEventPayload = {
        name: newEvent.name.trim(),
        categoryId: Number(newEvent.categoryId),
        description: newEvent.description.trim(),
        location: newEvent.location.trim(),
        capacity: Number(newEvent.capacity),
        startAt: toIsoDate(newEvent.startAt),
        endAt: toIsoDate(newEvent.endAt),
        registrationDeadline: toIsoDate(
            newEvent.registrationDeadline,
        ),
        isActive: newEvent.isActive === "true",
    };

    return apiClient.post<CreateEventResponse>(
        "/events",
        payload,
    );
}

export function getEventById(id: number): Promise<EventDetails> {
    return apiClient.get<EventDetails>(`/events/${id}`);
}

export function updateEvent(
    id: number,
    payload: CreateEventPayload,
): Promise<void> {
    return apiClient.put<void>(`/events/${id}`, payload);
}

export function deleteEvent(id: number): Promise<void> {
    return apiClient.delete<void>(`/events/${id}`);
}
