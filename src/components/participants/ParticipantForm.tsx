import { useState } from "react";
import type { SyntheticEvent } from "react";
import { ApiError } from "../../api/client.ts";
import type { ParticipantFormValues } from "../../types/participant.ts";

interface ParticipantFormProps {
    initialValues?: ParticipantFormValues;
    showActiveToggle?: boolean;
    submitLabel: string;
    onSubmit: (values: ParticipantFormValues) => Promise<void>;
    onCancel: () => void;
}

interface FieldErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getToday(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

function ParticipantForm({
    initialValues = { fullName: "", email: "", phone: "", dateOfBirth: null, isActive: true },
    showActiveToggle = false,
    submitLabel,
    onSubmit,
    onCancel,
}: ParticipantFormProps) {
    const [fullName, setFullName] = useState(initialValues.fullName);
    const [email, setEmail] = useState(initialValues.email);
    const [phone, setPhone] = useState(initialValues.phone);
    const [dateOfBirth, setDateOfBirth] = useState(initialValues.dateOfBirth ?? "");
    const [isActive, setIsActive] = useState(initialValues.isActive);
    const [isSaving, setIsSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const today = getToday();

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSaving) return;

        const values: ParticipantFormValues = {
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            dateOfBirth: dateOfBirth === "" ? null : dateOfBirth,
            isActive,
        };

        const errors: FieldErrors = {};
        if (values.fullName === "") {
            errors.fullName = "Full name is required.";
        } else if (values.fullName.length > 150) {
            errors.fullName = "Full name must not exceed 150 characters.";
        }

        if (values.email === "") {
            errors.email = "Email is required.";
        } else if (values.email.length > 255) {
            errors.email = "Email must not exceed 255 characters.";
        } else if (!EMAIL_PATTERN.test(values.email)) {
            errors.email = "Email is not valid.";
        }

        if (values.phone === "") {
            errors.phone = "Phone is required.";
        } else if (values.phone.length > 30) {
            errors.phone = "Phone must not exceed 30 characters.";
        }

        if (values.dateOfBirth !== null && values.dateOfBirth > today) {
            errors.dateOfBirth = "Date of birth cannot be in the future.";
        }

        setFieldErrors(errors);
        setServerErrors([]);
        if (Object.keys(errors).length > 0) return;

        setIsSaving(true);
        try {
            await onSubmit(values);
        } catch (err: unknown) {
            if (err instanceof ApiError && err.status === 409) {
                setFieldErrors({ email: err.message });
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

    const inputClass = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100";

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
                <label htmlFor="participant-name" className="block text-sm font-medium text-gray-700">
                    Full name
                </label>
                <input
                    id="participant-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isSaving}
                    aria-invalid={fieldErrors.fullName !== undefined}
                    className={inputClass}
                />
                {fieldErrors.fullName && <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>}
            </div>

            <div>
                <label htmlFor="participant-email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="participant-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSaving}
                    aria-invalid={fieldErrors.email !== undefined}
                    className={inputClass}
                />
                {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
                <label htmlFor="participant-phone" className="block text-sm font-medium text-gray-700">
                    Phone
                </label>
                <input
                    id="participant-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSaving}
                    aria-invalid={fieldErrors.phone !== undefined}
                    className={inputClass}
                />
                {fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>}
            </div>

            <div>
                <label htmlFor="participant-dob" className="block text-sm font-medium text-gray-700">
                    Date of birth (optional)
                </label>
                <input
                    id="participant-dob"
                    type="date"
                    value={dateOfBirth}
                    max={today}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={isSaving}
                    aria-invalid={fieldErrors.dateOfBirth !== undefined}
                    className={inputClass}
                />
                {fieldErrors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{fieldErrors.dateOfBirth}</p>}
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

export default ParticipantForm;