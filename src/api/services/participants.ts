import { apiClient } from "../client.ts";
import type {
    CreateParticipantRequest,
    Participant,
    ParticipantFilters,
    ParticipantsResponse,
    UpdateParticipantRequest,
} from "../../types/participant.ts";

export const participantsService = {
    getAll: (page: number, pageSize: number, filters: ParticipantFilters = {}) => {
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
        });

        if (filters.search) {
            params.set("search", filters.search);
        }
        if (filters.isActive !== undefined) {
            params.set("isActive", String(filters.isActive));
        }

        return apiClient.get<ParticipantsResponse>(`/participants?${params.toString()}`);
    },

    create: (request: CreateParticipantRequest) =>
        apiClient.post<Participant>("/participants", request),

    update: (id: number, request: UpdateParticipantRequest) =>
        apiClient.put<Participant>(`/participants/${id}`, request),
    remove: (id: number) => apiClient.delete<void>(`/participants/${id}`),
};