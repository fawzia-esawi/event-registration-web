import HorizontalLine from "../ui/HorizontalLine.tsx";
import {useEffect, useState} from "react";
import { type EventFilters, eventsService} from "../../api/services/events.ts";
import type { Event } from "../../types/event";
import { Pencil, Trash2 } from "lucide-react";
import EditEvent from "./EditEvent.tsx";
import {ApiError} from "../../api/client.ts";
import {navigate} from "../../utils/navigation.ts";
import type {Category} from "../../types/category.ts";

type EventListProps = {
    filters: EventFilters;
    refreshKey: number;
    onEventUpdated: () => void;
    onEventDeleted: (message: string)  => void;
    categories: Category[];
};

function EventList({ filters, refreshKey,onEventUpdated,onEventDeleted ,categories}: EventListProps,) {
    const [page, setPage] = useState<number>(1);
    const pageSize=10;
    const [totalPages, setTotalPages] = useState<number>(1);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [deletingEventId, setDeletingEventId] = useState<number | null>(null);

    async function handleDeleteEvent(event: Event) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${event.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingEventId(event.id);
            await eventsService.remove(event.id);
            onEventDeleted("Event deleted successfully.");
        } catch (error) {
            if (error instanceof ApiError) {
                onEventDeleted(error.message);
            } else {
                onEventDeleted("Failed to delete event.");
            }}
        finally {
            setDeletingEventId(null);
        }
    }


    useEffect(() => {
        let cancelled = false;

        eventsService.getAll(page, pageSize, filters)
            .then((data) => {
                if (cancelled) return;

                setEvents(data.items);
                setTotalPages(data.totalPages);
                setError(null);
            })
            .catch((error) => {
                if (cancelled) return;

                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("Failed to load events.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [page, filters, refreshKey]);

    if (loading) {
        return <p className="p-4 text-gray-500">Loading events...</p>;
    }

    if (error) {
        return <p className="p-4 text-red-600">{error}</p>;
    }
    return (
        <div >
          <div className="w-full min-h-[365px] max-h-[365px] overflow-x-auto overflow-y-auto">
            <div className="min-w-[1050px]">

                {/* Events Display Area */}

                <div className="grid grid-cols-[1.5fr_1fr_1.2fr_1.3fr_1.3fr_0.7fr_1.2fr_1fr_0.9fr_0.7fr_0.8fr]   gap-3 text-gray-500 font-medium py-3">
                    <span>EVENT</span>
                    <span>CATEGORY</span>
                    <span>LOCATION</span>
                    <span>START</span>
                    <span>END</span>
                    <span>CAPACITY</span>
                    <span>Active Registration Count</span>
                    <span>Available Seats</span>
                    <span>STATUS</span>
                    <span>ACTIVE</span>
                    <span>ACTION</span>
                </div>

                <HorizontalLine />

                {events.map((event) => (
                    <div key={event.id}>
                    <div className="grid grid-cols-[1.5fr_1fr_1.2fr_1.3fr_1.3fr_0.7fr_1.2fr_1fr_0.9fr_0.7fr_0.8fr] border-t border-[#D8D8D8] text-gray-500 gap-3 py-4">
                        <span className="text-[#4C1D95] font-medium">
                            {event.name}
                        </span>
                        <span>{event.categoryName}</span>
                        <span>{event.location}</span>
                        <span>
                            {new Date(event.startAt).toLocaleString()}
                        </span>
                        <span>{new Date(event.endAt).toLocaleString()}</span>
                        <span className="flex flex-col items-center">{event.capacity}</span>
                        <span className="text-center">{event.activeRegistrationCount}</span>
                        <span className="text-center">{event.availableSeats}</span>
                        <span>{event.eventStatus}</span>
                        <span>{event.isActive ? "Active" : "InActive"}</span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="rounded-md p-2 text-[#4C1D95] hover:bg-purple-100"
                                title="Edit Event"
                                onClick={() => setSelectedEventId(event.id)}
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                type="button"
                                className="rounded-md p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                                title="Delete Event"
                                onClick={() => handleDeleteEvent(event)}
                                disabled={deletingEventId === event.id}
                            >
                                <Trash2 size={18} />
                            </button>

                        </div>
                    </div>
                    <div className="flex justify-end pb-2">
                         <button className="bg-[#4C1D95] w-20 text-white text-sm p-2 rounded-xl " onClick={()=>navigate(`/events/${event.id}`)}>
                         view
                         </button>
                    </div>
                    </div>
                ))}
                {selectedEventId !== null && (
                    <EditEvent
                        id={selectedEventId}
                        onClose={() => setSelectedEventId(null)}
                        onEventUpdated={onEventUpdated}
                        categories={categories ?? []}
                    />
                )}
                {events.length === 0 && (
                    <p className="py-4 text-gray-500">No events found.</p>
                )}


            </div>
          </div>


            {/* Pagination Area */}
            <HorizontalLine></HorizontalLine>
            <div className="   mt-4 flex items-center justify-between">

                <div className="text-sm text-gray-500">
                    Showing {events.length} events
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={()=>{setPage(page-1)}}
                        className={`px-3 py-2 border border-[#D8D8D8] rounded-md text-sm ${
                            page === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                        disabled={page===1}
                    >
                        Previous
                    </button>

                    <button
                        className="px-3 py-2 bg-[#4C1D95] text-white rounded-md text-sm"
                    >
                        {page}
                    </button>

                    <button
                       onClick={()=>{setPage(page+1)}}
                        className={`px-3 py-2 border border-[#D8D8D8] rounded-md text-sm ${
                            page >= totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                       disabled={page >= totalPages}                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
}
export default EventList