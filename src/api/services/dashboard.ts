import { apiClient } from "../client.ts";
import type { DashboardSummary } from "../../types/dashboard.ts";

export const dashboardService = {
    getSummary: () => apiClient.get<DashboardSummary>("/dashboard/summary"),
};