import HorizontalLine from "../ui/HorizontalLine.tsx";
import {useCallback,useEffect,useState} from "react";
import {registrationsService} from "../../api/services/registrations.ts";
import type {Registration,RegistrationDetails} from "../../types/registration.ts";
import {ApiError} from "../../api/client.ts";
import InputField from "../ui/InputField.tsx";
import SelectField from "../ui/SelectField.tsx";
import {formatDateTime} from "../../utils/formatters.ts";

function RegistrationsList({ eventId , refreshKey ,onRegistrationChanged }: { eventId: number ,refreshKey: number,onRegistrationChanged: () => Promise<void>;}){
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState<number >();
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [operationError, setOperationError] = useState("");
    const [isProcessing, setIsProcessing] = useState<number | null>(null);
    const[popupViewOpen,setPopupViewOpen] =useState<boolean>(false);
    const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [popupViewError, setPopupViewError] = useState("");
    async function handleCancel(registrationId: number) {
        try {
            setIsProcessing(registrationId);
            setOperationError("");
            setSuccessMessage("");

            const result = await registrationsService.cancel(registrationId);

            setSuccessMessage(result.message);
            await onRegistrationChanged();
        } catch (error) {
            console.log("Cancel error:", error);
            console.log("Is ApiError:", error instanceof ApiError);

            if (error instanceof ApiError) {
                console.log("Status:", error.status);
                console.log("Message:", error.message);
                setOperationError(error.message);
            } else {
                setOperationError("Something went wrong. Please try again.");
            }
        } finally {
            setIsProcessing(null);
        }
    }
    async function handleActivate(registration: Registration) {
        try {
            setIsProcessing(registration.id);
            setOperationError("");
            setSuccessMessage("");

            const result = await registrationsService.create(eventId, {
                participantId: registration.participantId,
                notes: registration.notes ?? undefined
            });

            setSuccessMessage(result.message);
            await onRegistrationChanged();
        } catch (error) {
            if (error instanceof ApiError) {
                setOperationError(error.message);
            } else {
                setOperationError("Something went wrong. Please try again.");
            }
        } finally {
            setIsProcessing(null);
        }
    }

   // Opens the popup and loads the selected registration's details.
    async function popupRegistrationView(registrationsId:number){
        setPopupViewOpen(true);
        setRegistrationDetails(null);
        setPopupViewError("");
        setIsLoadingDetails(true);

        try {
            const result = await registrationsService.getById(registrationsId);
            setRegistrationDetails(result);
        } catch (error) {
            if (error instanceof ApiError) {
                setPopupViewError(error.message);
            } else {
                setPopupViewError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoadingDetails(false);
        }

    }

    const loadRegistrations = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await registrationsService.getAll(
                eventId,
                page,
                10,
                debouncedSearch || undefined,
                statusFilter
            );

            setRegistrations(response.items);
            setTotalPages(response.totalPages);
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [eventId, page, debouncedSearch, statusFilter]);

    // Wait until the user stops typing before updating the search value
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch registrations whenever the event, page, filters, or refresh key changes.
    useEffect(() => {
        const timer = setTimeout(() => {
            void loadRegistrations();
        }, 0);

        return () => clearTimeout(timer);
    }, [loadRegistrations, refreshKey]);

    // Hide operation messages automatically after three seconds.
    useEffect(() => {
        if (!successMessage && !operationError) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
            setOperationError("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage, operationError]);

    return (
        <div>
            {/* Show the popup only when it is open. */}
            {popupViewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl border border-[#D8D8D8] bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#4C1D95]">
                                Registration Details
                            </h2>

                            <button
                                type="button"
                                onClick={()=>setPopupViewOpen(false)}
                                className="text-2xl text-gray-500 hover:text-gray-800"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        {isLoadingDetails ? (
                            <p className="py-6 text-center text-gray-500">
                                Loading registration details...
                            </p>
                        ) : popupViewError ? (
                            <p className="py-6 text-center text-red-600">
                                {popupViewError}
                            </p>
                        ) : registrationDetails ? (
                            <div className="space-y-4">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Participant Name
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {registrationDetails.participantName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Registration Status
                                    </p>
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-sm ${
                                            registrationDetails.status === 1
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                            {registrationDetails.status === 1
                                ? "Active"
                                : "Cancelled"}
                        </span>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Notes
                                    </p>
                                    <p className="whitespace-pre-wrap text-gray-900">
                                        {registrationDetails.notes || "No notes"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Registered At
                                    </p>
                                    <p className="text-gray-900">
                                        {formatDateTime(registrationDetails.registeredAt)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Cancelled At
                                    </p>
                                    <p className="text-gray-900">
                                        {registrationDetails.cancelledAt
                                            ? formatDateTime(registrationDetails.cancelledAt)
                                            : "—"}
                                    </p>
                                </div>

                            </div>
                        ) : null}
                    </div>
                </div>
            )}
            {successMessage && (
                <p className="mb-3 text-green-600">
                    {successMessage}
                </p>
            )}

            {operationError && (
                <p className="mb-3 text-red-600">
                    {operationError}
                </p>
            )}
            {/* Search and filter the registrations. */}
            <div className="flex flex-row gap-2">
                <InputField
                    label="Search"
                    id="registrationsSearch"
                    value={searchInput}
                    type="text"
                    placeholder="Search an event's registrations by participant name, email, or phone..."
                    className="min-w-[220px] flex-[2]"
                    onChange={(e) => setSearchInput(e.target.value)}

                />
                <SelectField
                    label="Status"
                    id="statusFilter"
                    className="min-w-[140px] flex-1"
                    value={statusFilter ?? ""}
                    onChange={(e) =>
                        setStatusFilter(e.target.value === "" ? undefined  : Number(e.target.value))}
                >
                    <option  value="" >
                        Select Status
                    </option>

                    <option value="1" >
                        Active
                    </option>
                    <option value="2" >
                        Cancelled
                    </option>
                </SelectField>
                <button
                    type="button"
                    onClick={() => {
                        setSearchInput("");
                        setDebouncedSearch("");
                        setStatusFilter(undefined);
                        setPage(1);
                    }}
                    className="self-end rounded-md border border-[#D8D8D8] px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Clear Filters
                </button>
            </div>

            <HorizontalLine></HorizontalLine>

            {/* Display the registrations returned for the current page. */}
            <div className="w-full min-h-[365px] max-h-[365px] overflow-x-auto overflow-y-auto">
                {isLoading ? (
                    <p className="p-4 text-gray-500">
                        Loading registrations...
                    </p>
                ) : error ? (
                    <p className="p-4 text-red-600">{error}</p>
                ) : registrations.length === 0 ? (
                    <p className="p-4 text-gray-500">
                        No registrations found.
                    </p>
                ) : (
                    <div className="min-w-[1050px]">



                        <div className="grid grid-cols-[1.5fr_1.5fr_1.2fr_1.3fr_1fr_0.8fr] gap-3 text-gray-500 font-medium py-3">
                            <span>PARTICIPANT</span>
                            <span>EMAIL</span>
                            <span>PHONE</span>
                            <span>REGISTERED AT</span>
                            <span>STATUS</span>
                            <span>ACTION</span>
                        </div>

                        <HorizontalLine />

                        {registrations.map((registration) => (
                            <div key={registration.id}>
                                <div className="grid grid-cols-[1.5fr_1.5fr_1.2fr_1.3fr_1fr_0.8fr] border-t border-[#D8D8D8] text-gray-500 gap-3 py-4">
                                <span className="text-[#4C1D95] font-medium">
                                    {registration.participantName}
                                </span>
                                    <span>
                                    {registration.participantEmail}
                                </span>
                                    <span>
                                    {registration.participantPhone}
                                </span>
                                    <span>
                                    {new Date(registration.registeredAt).toLocaleString()}
                                </span>
                                    <span className="text-start">
                                  {registration.statusName}
                                </span>
                                    <div className="flex  items-center  gap-2">
                                        <button
                                            type="button"
                                            className="rounded-md p-2 text-[#4C1D95] hover:bg-purple-100"
                                            title="View Registration"
                                            onClick={()=>{ popupRegistrationView(registration.id)}}
                                        >
                                            view
                                        </button>

                                        <button
                                            type="button"
                                            disabled={isProcessing === registration.id}
                                            className={`rounded-md p-2 ${
                                                registration.statusName === "Active"
                                                    ? "text-red-600 hover:bg-red-100"
                                                    : "text-green-600 hover:bg-green-100"
                                            }`}
                                            onClick={() => {
                                                if (registration.statusName === "Active") {
                                                    handleCancel(registration.id);
                                                } else {
                                                    handleActivate(registration);
                                                }
                                            }}
                                            title={registration.statusName === "Active" ? "Cancel Registration" : "Activate Registration"}
                                        >
                                            {isProcessing === registration.id
                                                ? "Please wait..."
                                                : registration.statusName === "Active"
                                                    ? "Cancel"
                                                    : "Activate"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>

            {/* Pagination Area */}
            <HorizontalLine></HorizontalLine>
            <div className="   mt-4 flex items-center justify-between">

                <div className="text-sm text-gray-500">
                    Showing {registrations.length} registrations
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={()=>{setPage(page-1)}}
                        className={`px-3 py-2 border border-[#D8D8D8] rounded-md text-sm ${
                            page === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                        disabled={page===1}
                    >
                        Previous
                    </button>

                    <button
                        className="px-3 py-2 bg-[#4C1D95] text-white rounded-md text-sm"
                    >
                        {page}
                    </button>

                    <button
                        onClick={()=>{setPage(page+1)}}
                        className={`px-3 py-2 border border-[#D8D8D8] rounded-md text-sm ${
                            page >= totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                        disabled={page >= totalPages}                    >
                        Next
                    </button>
                </div>

            </div>

        </div>
    );
}
export default RegistrationsList;