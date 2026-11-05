export interface ApiErrorResponse {
    success: boolean;
    timestamp: string;
    message: string;
    errors: string[];
}
export interface PagedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}