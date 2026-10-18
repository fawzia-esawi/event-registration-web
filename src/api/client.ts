import type { ApiErrorResponse } from "../types/common.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {
    status: number;
    data: ApiErrorResponse | null;

    constructor(status: number, message: string, data: ApiErrorResponse | null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError(0, "Cannot reach the server. Please try again.", null);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    let data: unknown = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const errorData = data as ApiErrorResponse | null;
        throw new ApiError(
            response.status,
            errorData?.message ?? "Request failed.",
            errorData,
        );
    }

    return data as T;
}

export const apiClient = {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
    put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
    patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
    delete: <T>(path: string) => request<T>("DELETE", path),
};