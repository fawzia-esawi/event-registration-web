
import EventForm from "./EventForm.tsx";
import { createEvents } from "../../api/services/events.ts";
import type {
    CreateEventResponse,
    EventFormData,
} from "../../types/event.ts";

type CreateEventProps = {
    onClose: () => void;
    onEventCreated: () => void;
};

function CreateEvent({ onClose, onEventCreated }: CreateEventProps) {
    async function handleCreate(data: EventFormData) {
        const response: CreateEventResponse = await createEvents(data);

        alert(response.message);
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
