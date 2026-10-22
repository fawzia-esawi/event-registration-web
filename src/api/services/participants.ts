import { apiClient } from "../client.ts";
import type { ParticipantsResponse } from "../../types/participant.ts";

export const participantsService = {
    getAll: (page: number, pageSize: number) =>
        apiClient.get<ParticipantsResponse>(`/participants?page=${page}&pageSize=${pageSize}`),
};