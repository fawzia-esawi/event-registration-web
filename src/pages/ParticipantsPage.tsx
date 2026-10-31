import { useCallback, useEffect, useState } from "react";
import { participantsService } from "../api/services/participants.ts";
import ParticipantForm from "../components/participants/ParticipantForm.tsx";
import Modal from "../components/ui/Modal.tsx";
import { useApi } from "../hooks/useApi.ts";
import { useDebouncedValue } from "../hooks/useDebouncedValue.ts";
import type { Participant, ParticipantFormValues } from "../types/participant.ts";

const PAGE_SIZE = 10;
const SUCCESS_MESSAGE_DURATION_MS = 5000;

function ParticipantsPage() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [status, setStatus] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editing, setEditing] = useState<Participant | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (successMessage === null) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setSuccessMessage(null);
        }, SUCCESS_MESSAGE_DURATION_MS);

        return () => window.clearTimeout(timer);
    }, [successMessage]);

    const search = useDebouncedValue(searchInput.trim(), 400);

    const fetchParticipants = useCallback(
        () =>
            participantsService.getAll(page, PAGE_SIZE, {
                search,
                isActive: status === "" ? undefined : status === "true",
            }),
        [page, search, status],
    );

    const { data, isLoading, error, reload } = useApi(fetchParticipants);

    const hasFilters = searchInput.trim() !== "" || status !== "";

    function handleSearchChange(value: string) {
        setSearchInput(value);
        setPage(1);
    }

    function handleStatusChange(value: string) {
        setStatus(value);
        setPage(1);
    }

    function clearFilters() {
        setSearchInput("");
        setStatus("");
        setPage(1);
    }

    function openCreate() {
        setSuccessMessage(null);
        setIsCreateOpen(true);
    }

    function openEdit(participant: Participant) {
        setSuccessMessage(null);
        setEditing(participant);
    }

    async function handleCreate(values: ParticipantFormValues) {
        const created = await participantsService.create({
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            dateOfBirth: values.dateOfBirth,
        });
        setIsCreateOpen(false);
        setSuccessMessage(`Participant "${created.fullName}" was added.`);
        reload();
    }

    async function handleUpdate(values: ParticipantFormValues) {
        if (editing === null) return;
        const updated = await participantsService.update(editing.id, values);
        setEditing(null);
        setSuccessMessage(`Participant "${updated.fullName}" was updated.`);
        reload();
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Participants</h1>
                <button
                    onClick={openCreate}
                    className="rounded-lg bg-[#6D28D9] px-4 py-2 text-white hover:bg-[#4C1D95]"
                >
                    Add participant
                </button>
            </div>

            {successMessage && (
                <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{successMessage}</div>
            )}

            <div className="mt-4 flex flex-wrap items-end gap-3 rounded-lg bg-white p-4 shadow">
                <div className="min-w-[220px] flex-1">
                    <label htmlFor="participant-search" className="block text-sm font-medium text-gray-700">
                        Search
                    </label>
                    <input
                        id="participant-search"
                        type="text"
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by name, email or phone..."
                        maxLength={100}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                </div>

                <div className="min-w-[160px]">
                    <label htmlFor="participant-status" className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        id="participant-status"
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                    >
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={clearFilters}
                    disabled={!hasFilters}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Clear filters
                </button>
            </div>

            <div className="mt-4">
                {isLoading && <p className="text-gray-600">Loading participants...</p>}

                {!isLoading && error && (
                    <div className="rounded-lg bg-red-50 p-4">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={reload}
                            className="mt-2 rounded-lg bg-[#6D28D9] px-4 py-2 text-white hover:bg-[#4C1D95]"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !error && data && data.items.length === 0 && (
                    <div className="rounded-lg bg-white p-4 text-gray-600 shadow">
                        <p>{hasFilters ? "No participants match your filters." : "No participants found."}</p>
                        {hasFilters && (
                            <button onClick={clearFilters} className="mt-2 text-[#6D28D9] hover:underline">
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {!isLoading && !error && data && data.items.length > 0 && (
                    <>
                        <div className="overflow-x-auto rounded-lg bg-white shadow">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Phone</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((participant) => (
                                        <tr key={participant.id} className="border-t">
                                            <td className="px-4 py-3 font-medium">{participant.fullName}</td>
                                            <td className="px-4 py-3 text-gray-600">{participant.email}</td>
                                            <td className="px-4 py-3 text-gray-600">{participant.phone}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={
                                                        participant.isActive
                                                            ? "rounded-full bg-green-100 px-3 py-1 text-green-800"
                                                            : "rounded-full bg-gray-200 px-3 py-1 text-gray-700"
                                                    }
                                                >
                                                    {participant.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => openEdit(participant)}
                                                    className="text-[#6D28D9] hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Showing {data.items.length} of {data.totalCount} participants
                            </span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page <= 1}
                                    className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {data.page} of {data.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= data.totalPages}
                                    className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {isCreateOpen && (
                <Modal title="Add participant">
                    <ParticipantForm
                        submitLabel="Add participant"
                        onSubmit={handleCreate}
                        onCancel={() => setIsCreateOpen(false)}
                    />
                </Modal>
            )}

            {editing !== null && (
                <Modal title="Edit participant">
                    <ParticipantForm
                        initialValues={{
                            fullName: editing.fullName,
                            email: editing.email,
                            phone: editing.phone,
                            dateOfBirth: editing.dateOfBirth,
                            isActive: editing.isActive,
                        }}
                        showActiveToggle
                        submitLabel="Save changes"
                        onSubmit={handleUpdate}
                        onCancel={() => setEditing(null)}
                    />
                </Modal>
            )}
        </div>
    );
}

export default ParticipantsPage;