import HorizontalLine from "../ui/HorizontalLine.tsx";
import {useEffect, useState} from "react";
import {deleteEvent, type EventFilters, getEvents} from "../../api/services/events.ts";
import type { Event } from "../../types/event";
import { Pencil, Trash2 } from "lucide-react";
import EditEvent from "./EditEvent.tsx";

type EventListProps = {
    filters: EventFilters;
    refreshKey: number;
    onEventUpdated: () => void;
};

function EventList({ filters, refreshKey,onEventUpdated }: EventListProps,) {
    const [page, setPage] = useState<number>(1);
    const pageSize=2;
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
            await deleteEvent(event.id);
            alert("Event deleted successfully.");
            onEventUpdated();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete event."
            );
        } finally {
            setDeletingEventId(null);
        }
    }

    useEffect(() => {
        setPage(1);
    }, [filters]);
    useEffect(() => {
        setLoading(true);
        setError(null);
        getEvents(page,pageSize,filters)
            .then((data) => {
                setEvents(data.items);
                setTotalPages(data.totalPages)
            })
            .catch(() => {
                setError("Failed to load events.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page,filters,refreshKey]);

    if (loading) {
        return <p className="p-4 text-gray-500">Loading events...</p>;
    }

    if (error) {
        return <p className="p-4 text-red-600">{error}</p>;
    }
    return (
        <div >

            {/* Events Display Area */}
            <div className="min-h-[365px] flex-col max-h-[365px] overflow-y-auto ">
                <div className="grid grid-cols-[2fr_1.2fr_1.5fr_1.3fr_1fr_1.3fr_1fr_0.8fr_0.8fr] text-gray-500">
                    <span>EVENT</span>
                    <span>CATEGORY</span>
                    <span>LOCATION</span>
                    <span>START</span>
                    <span>END</span>
                    <span>CAPACITY</span>
                    <span>STATUS</span>
                    <span>ACTIVE</span>
                    <span>ACTION</span>
                </div>

                <HorizontalLine />

                {events.map((event) => (
                    <div
                        key={event.id}
                        className="grid grid-cols-[2fr_1.2fr_1.5fr_1.3fr_1fr_1.3fr_1fr_0.8fr_0.8fr] border-t border-[#D8D8D8] text-gray-500 gap-3 py-4"
                    >
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
                ))}
                {selectedEventId !== null && (
                    <EditEvent
                        id={selectedEventId}
                        onClose={() => setSelectedEventId(null)}
                        onEventUpdated={onEventUpdated}
                    />
                )}
                {events.length === 0 && (
                    <p className="py-4 text-gray-500">No events found.</p>
                )}
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