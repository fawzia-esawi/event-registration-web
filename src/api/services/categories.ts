import { apiClient } from "../client.ts";
import type { Category } from "../../types/category.ts";

export const categoriesService = {
    getAll: (includeInactive: boolean) =>
        apiClient.get<Category[]>(`/categories?includeInactive=${includeInactive}`),
};