
import { useState } from "react";
import InputField from "../ui/InputField.tsx";
import SelectField from "../ui/SelectField.tsx";
import type { EventFormData } from "../../types/event.ts";

type EventFormProps = {
    title: string;
    submitLabel: string;
    initialData?: EventFormData;
    onClose: () => void;
    onSubmit: (data: EventFormData) => Promise<void>;
};

const emptyForm: EventFormData = {
    name: "",
    categoryId: "",
    description: "",
    location: "",
    capacity: "",
    startAt: "",
    endAt: "",
    registrationDeadline: "",
    isActive: "",
};

function EventForm({
                       title,
                       submitLabel,
                       initialData,
                       onClose,
                       onSubmit,
                   }: EventFormProps) {
    const [formData, setFormData] = useState<EventFormData>(
        () => initialData ?? { ...emptyForm }
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(name: keyof EventFormData, value: string) {
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const startAt = new Date(formData.startAt);
        const endAt = new Date(formData.endAt);
        const deadline = new Date(formData.registrationDeadline);

        if (endAt <= startAt) {
            alert("End date must be after start date.");
            return;
        }

        if (deadline > startAt) {
            alert(
                "Registration deadline must be before or equal to start date."
            );
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-medium text-[#4C1D95]">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-gray-500 hover:text-gray-800"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 text-gray-600">
                        <div className="flex flex-row justify-around gap-4">
                            <InputField
                                label="Event Name"
                                type="text"
                                placeholder="Enter event name"
                                id="eventName"
                                className="min-w-0 flex-1"
                                required
                                maxLength={150}
                                value={formData.name}
                                onChange={(e) =>
                                    updateField("name", e.target.value)
                                }
                            />

                            <SelectField
                                label="Category"
                                id="category"
                                className="min-w-0 flex-1"
                                required
                                value={formData.categoryId}
                                onChange={(e) =>
                                    updateField("categoryId", e.target.value)
                                }
                            >
                                <option value="">Select Category</option>
                                <option value="1">Technology</option>
                            </SelectField>
                        </div>

                        <InputField
                            label="Description"
                            id="eventDescription"
                            placeholder="Enter event description"
                            type="text"
                            className="min-w-0 flex-1"
                            maxLength={1000}
                            value={formData.description}
                            onChange={(e) =>
                                updateField("description", e.target.value)
                            }
                        />

                        <div className="flex flex-row justify-around gap-4">
                            <InputField
                                label="Location"
                                id="eventLocation"
                                placeholder="Enter event location"
                                type="text"
                                className="min-w-0 flex-1"
                                required
                                maxLength={200}
                                value={formData.location}
                                onChange={(e) =>
                                    updateField("location", e.target.value)
                                }
                            />

                            <InputField
                                label="Capacity"
                                placeholder="e.g. 50"
                                id="capacity"
                                type="number"
                                className="min-w-0 flex-1"
                                required
                                min={1}
                                max={10000}
                                step={1}
                                value={formData.capacity}
                                onChange={(e) =>
                                    updateField("capacity", e.target.value)
                                }
                            />
                        </div>

                        <div className="flex flex-row justify-around gap-4">
                            <InputField
                                label="Start At"
                                id="startAt"
                                type="datetime-local"
                                className="min-w-0 flex-1"
                                required
                                value={formData.startAt}
                                onChange={(e) =>
                                    updateField("startAt", e.target.value)
                                }
                            />

                            <InputField
                                label="End At"
                                id="endAt"
                                type="datetime-local"
                                className="min-w-0 flex-1"
                                required
                                value={formData.endAt}
                                onChange={(e) =>
                                    updateField("endAt", e.target.value)
                                }
                            />
                        </div>

                        <div className="flex flex-row justify-around gap-4">
                            <InputField
                                label="Registration Deadline"
                                id="registrationDeadline"
                                type="datetime-local"
                                className="min-w-0 flex-1"
                                required
                                value={formData.registrationDeadline}
                                onChange={(e) =>
                                    updateField(
                                        "registrationDeadline",
                                        e.target.value
                                    )
                                }
                            />

                            <SelectField
                                label="Is Active"
                                id="isActive"
                                className="min-w-0 flex-1"
                                required
                                value={formData.isActive}
                                onChange={(e) =>
                                    updateField("isActive", e.target.value)
                                }
                            >
                                <option value="">Select Activity</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </SelectField>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg border border-gray-300 bg-[#4C1D95] px-4 py-2 text-white hover:bg-[#3B1675] disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : submitLabel}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventForm;
