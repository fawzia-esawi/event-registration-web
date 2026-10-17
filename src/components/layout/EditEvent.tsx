import { useEffect, useState } from "react";
import EventForm from "./EventForm.tsx";
import {getEventById, updateEvent} from "../../api/services/events.ts";
import {type CreateEventPayload, type EventDetails, type EventFormData} from "../../types/event.ts";

interface EditEventProps {
    id: number;
    onClose: () => void;
    onEventUpdated: () => void;
}
function toDateTimeLocal(value: string): string {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const offset = date.getTimezoneOffset() * 60_000;

    return new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
}
function EditEvent({ id, onClose ,onEventUpdated}: EditEventProps) {
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEvent() {
            try {
                const data = await getEventById(id);
                setEvent(data);
            } catch {
                setError("Failed to load event details.");
            }
        }

        loadEvent();
    }, [id]);

    if (error) {
        return (
            <div>
                <p className="text-red-600">{error}</p>
                <button type="button" onClick={onClose}>
                    Close
                </button>
            </div>
        );
    }

    if (!event) {
        return <p>Loading event details...</p>;
    }

    const initialData: EventFormData = {
        name: event.name,
        categoryId: String(event.categoryId),
        description: event.description ?? "",
        location: event.location,
        capacity: String(event.capacity),
        startAt: toDateTimeLocal(event.startAt),
        endAt: toDateTimeLocal(event.endAt),
        registrationDeadline: toDateTimeLocal(
            event.registrationDeadline
        ),
        isActive: String(event.isActive),
    };

    return (
        <EventForm
            title="Edit Event"
            submitLabel="Save Changes"
            initialData={initialData}
            onClose={onClose}
            onSubmit={async (data: EventFormData) => {
                const payload: CreateEventPayload = {
                    name: data.name,
                    categoryId: Number(data.categoryId),
                    description: data.description,
                    location: data.location,
                    capacity: Number(data.capacity),
                    startAt: data.startAt,
                    endAt: data.endAt,
                    registrationDeadline: data.registrationDeadline,
                    isActive: data.isActive === "true",
                };

                try {
                    await updateEvent(id, payload);
                    alert("Event updated successfully.");
                    onEventUpdated();
                    onClose();
                } catch (error) {
                    alert(
                        error instanceof Error
                            ? error.message
                            : "Failed to update event."
                    );
                }
            }}        />
    );
}

export default EditEvent;