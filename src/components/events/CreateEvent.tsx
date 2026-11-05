
import EventForm from "./EventForm.tsx";
import {eventsService} from "../../api/services/events.ts";
import type {
    EventFormData,
} from "../../types/event.ts";
import type {Category} from "../../types/category.ts";

type CreateEventProps = {
    onClose: () => void;
    onEventCreated: () => void;
    categories: Category[];
};

function CreateEvent({ onClose, onEventCreated ,categories}: CreateEventProps) {
    async function handleCreate(data: EventFormData) {
        await eventsService.create(data);

        onEventCreated();
        onClose();
    }

    return (
        <EventForm
            title="Create Event"
            submitLabel="Create Event"
            onClose={onClose}
            onSubmit={handleCreate}
            categories={categories}
        />
    );
}

export default CreateEvent;
