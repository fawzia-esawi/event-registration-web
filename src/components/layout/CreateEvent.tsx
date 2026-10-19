
import EventForm from "./EventForm.tsx";
import {eventsService} from "../../api/services/events.ts";
import type {
    EventFormData,
} from "../../types/event.ts";

type CreateEventProps = {
    onClose: () => void;
    onEventCreated: () => void;
};

function CreateEvent({ onClose, onEventCreated }: CreateEventProps) {
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
        />
    );
}

export default CreateEvent;
