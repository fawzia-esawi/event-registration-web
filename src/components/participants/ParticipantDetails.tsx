import { useCallback } from "react";
import { participantsService } from "../../api/services/participants.ts";
import { useApi } from "../../hooks/useApi.ts";
import Modal from "../ui/Modal.tsx";

interface ParticipantDetailsProps {
    participantId: number;
    onClose: () => void;
}

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function formatDate(value: string): string {
    return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
        dateStyle: "medium",
        timeZone: "UTC",
    });
}

function ParticipantDetails({ participantId, onClose }: ParticipantDetailsProps) {
    const fetchParticipant = useCallback(
        () => participantsService.getById(participantId),
        [participantId],
    );

    const { data: participant, isLoading, error, reload } = useApi(fetchParticipant);

    return (
        <Modal title="Participant details">
            {isLoading && <p className="text-gray-600">Loading participant...</p>}

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

            {!isLoading && !error && participant && (
                <dl className="space-y-3 text-sm">
                    <div>
                        <dt className="font-medium text-gray-500">Full name</dt>
                        <dd className="text-gray-900">{participant.fullName}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Email</dt>
                        <dd className="text-gray-900">{participant.email}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Phone</dt>
                        <dd className="text-gray-900">{participant.phone}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Date of birth</dt>
                        <dd className="text-gray-900">
                            {participant.dateOfBirth ? formatDate(participant.dateOfBirth) : "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Status</dt>
                        <dd>
                            <span
                                className={
                                    participant.isActive
                                        ? "rounded-full bg-green-100 px-3 py-1 text-green-800"
                                        : "rounded-full bg-gray-200 px-3 py-1 text-gray-700"
                                }
                            >
                                {participant.isActive ? "Active" : "Inactive"}
                            </span>
                        </dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Created</dt>
                        <dd className="text-gray-900">{formatDateTime(participant.createdAt)}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Last updated</dt>
                        <dd className="text-gray-900">
                            {participant.updatedAt ? formatDateTime(participant.updatedAt) : "—"}
                        </dd>
                    </div>
                </dl>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}

export default ParticipantDetails;