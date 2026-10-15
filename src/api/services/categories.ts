import { apiClient } from "../client.ts";
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from "../../types/category.ts";

export const categoriesService = {
    getAll: (includeInactive: boolean) =>
        apiClient.get<Category[]>(`/categories?includeInactive=${includeInactive}`),

    getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),

    create: (request: CreateCategoryRequest) =>
        apiClient.post<Category>("/categories", request),

    update: (id: number, request: UpdateCategoryRequest) =>
        apiClient.put<Category>(`/categories/${id}`, request),
};