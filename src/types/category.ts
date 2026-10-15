export interface Category {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateCategoryRequest {
    name: string;
    description: string | null;
}

export interface CategoryFormValues {
    name: string;
    description: string | null;
    isActive: boolean;
}

export type UpdateCategoryRequest = CategoryFormValues;