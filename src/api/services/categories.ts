import { apiClient } from "../client.ts";
import type { Category, CreateCategoryRequest } from "../../types/category.ts";

export const categoriesService = {
    getAll: (includeInactive: boolean) =>
        apiClient.get<Category[]>(`/categories?includeInactive=${includeInactive}`),

    create: (request: CreateCategoryRequest) =>
        apiClient.post<Category>("/categories", request),
};