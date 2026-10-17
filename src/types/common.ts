export interface ApiErrorResponse {
    success: boolean;
    timestamp: string;
    message: string;
    errors: string[];
}