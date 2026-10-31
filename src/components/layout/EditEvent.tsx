import { useEffect, useState } from "react";
import EventForm from "./EventForm.tsx";
import {eventsService} from "../../api/services/events.ts";
import {type CreateEventPayload, type EventDetails, type EventFormData} from "../../types/event.ts";
import {ApiError} from "../../api/client.ts";
import { toIsoDate,toDateTimeLocal } from "../../utils/formatters.ts";
import type {Category} from "../../types/category.ts";

interface EditEventProps {
    id: number;
    onClose: () => void;
    onEventUpdated: () => void;
    categories: Category[];
}
function EditEvent({ id, onClose ,onEventUpdated,categories}: EditEventProps) {
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEvent() {
            try {
                const data = await eventsService.getById(id);
                setEvent(data);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("Failed to load event details.");
                }
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
            categories={categories ?? []}
            onSubmit={async (data: EventFormData) => {
                const payload: CreateEventPayload = {
                    name: data.name,
                    categoryId: Number(data.categoryId),
                    description: data.description,
                    location: data.location,
                    capacity: Number(data.capacity),
                    startAt: toIsoDate(data.startAt),
                    endAt: toIsoDate(data.endAt),
                    registrationDeadline: toIsoDate(data.registrationDeadline),
                    isActive: data.isActive === "true",
                };

                await eventsService.update(id, payload);

                onEventUpdated();
                onClose();
            }}        />
    );
}

export default EditEvent;