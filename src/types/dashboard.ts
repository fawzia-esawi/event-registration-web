export interface UpcomingEvent {
    eventId: number;
    eventName: string;
    categoryName: string;
    startAt: string;
    location: string;
    capacity: number;
    activeRegistrationCount: number;
    availableSeats: number;
}
export interface DashboardSummary {
    totalActiveCategories: number;
    totalActiveParticipants: number;
    totalUpcomingActiveEvents: number;
    totalActiveRegistrations: number;
    upcomingEvents: UpcomingEvent[];
}