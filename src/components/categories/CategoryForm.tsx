import { useState } from "react";
import type { SyntheticEvent } from "react";
import { ApiError } from "../../api/client.ts";
import type { CategoryFormValues } from "../../types/category.ts";

interface CategoryFormProps {
    initialName?: string;
    initialDescription?: string;
    initialIsActive?: boolean;
    showActiveToggle?: boolean;
    submitLabel: string;
    onSubmit: (values: CategoryFormValues) => Promise<void>;
    onCancel: () => void;
}

interface FieldErrors {
    name?: string;
    description?: string;
}

function CategoryForm({
    initialName = "",
    initialDescription = "",
    initialIsActive = true,
    showActiveToggle = false,
    submitLabel,
    onSubmit,
    onCancel,
}: CategoryFormProps) {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [isActive, setIsActive] = useState(initialIsActive);
    const [isSaving, setIsSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSaving) return;

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        const errors: FieldErrors = {};
        if (trimmedName.length === 0) {
            errors.name = "Name is required.";
        } else if (trimmedName.length < 2) {
            errors.name = "Name must be at least 2 characters.";
        } else if (trimmedName.length > 100) {
            errors.name = "Name must not exceed 100 characters.";
        }
        if (trimmedDescription.length > 500) {
            errors.description = "Description must not exceed 500 characters.";
        }

        setFieldErrors(errors);
        setServerErrors([]);
        if (Object.keys(errors).length > 0) return;

        setIsSaving(true);
        try {
            await onSubmit({
                name: trimmedName,
                description: trimmedDescription === "" ? null : trimmedDescription,
                isActive,
            });
        } catch (err: unknown) {
            if (err instanceof ApiError && err.status === 409) {
                setFieldErrors({ name: err.message });
            } else if (err instanceof ApiError && err.status === 400 && err.data !== null && err.data.errors.length > 0) {
                setServerErrors(err.data.errors);
            } else if (err instanceof ApiError) {
                setServerErrors([err.message]);
            } else {
                setServerErrors(["Something went wrong."]);
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {serverErrors.length > 0 && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    <ul className="list-disc pl-5">
                        {serverErrors.map((message) => (
                            <li key={message}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSaving}
                    aria-invalid={fieldErrors.name !== undefined}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                />
                {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
            </div>

            <div>
                <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">
                    Description (optional)
                </label>
                <textarea
                    id="category-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSaving}
                    aria-invalid={fieldErrors.description !== undefined}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                />
                {fieldErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
                )}
            </div>

            {showActiveToggle && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        disabled={isSaving}
                    />
                    Active
                </label>
            )}

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-[#6D28D9] px-4 py-2 text-white hover:bg-[#4C1D95] disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default CategoryForm;