import { useCallback, useState } from "react";
import { participantsService } from "../api/services/participants.ts";
import { useApi } from "../hooks/useApi.ts";

const PAGE_SIZE = 2;

function ParticipantsPage() {
    const [page, setPage] = useState(1);

    const fetchParticipants = useCallback(
        () => participantsService.getAll(page, PAGE_SIZE),
        [page],
    );

    const { data, isLoading, error, reload } = useApi(fetchParticipants);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Participants</h1>

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
                    <p className="text-gray-600">No participants found.</p>
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
        </div>
    );
}

export default ParticipantsPage;