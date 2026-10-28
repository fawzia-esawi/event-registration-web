import {useCallback,useEffect, useState} from "react";
import {eventsService} from "../api/services/events.ts";
import type {EventDetails} from "../types/event.ts";
import HorizontalLine from "../components/ui/HorizontalLine.tsx";
import InfoEvent from "../components/ui/InfoEvent.tsx";
import {formatDateTime} from "../utils/formatters.ts";
import StatusEventCard from "../components/ui/StatusEventCard.tsx";
import {ApiError} from "../api/client.ts";
import RegistrationsList from "../components/layout/RegistrationsList.tsx";
import SelectField from "../components/ui/SelectField.tsx";
import type {CreateRegistration} from "../types/registration.ts";
import {registrationsService} from "../api/services/registrations.ts";


function EventDetailsPage({ eventId }: { eventId: number }) {
    const [eventDetails, setEventDetails] = useState<EventDetails>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
    const [participantId, setParticipantId] = useState<number | "">("");
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState("");
    const [registrationError, setRegistrationError] = useState("");
    const [registrationsRefreshListKey, setRegistrationsRefreshListKey] = useState(0);


    const loadEventDetails = useCallback(async () => {
        setError("");

        try {
            const event = await eventsService.getById(eventId);
            setEventDetails(event);
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    }, [eventId]);

    // Load event details whenever the event ID changes.
    useEffect(() => {
        const timer = setTimeout(() => {
            void loadEventDetails().finally(() => {
                setIsLoading(false);
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [loadEventDetails]);

    // Clear registration messages after three seconds.
    useEffect(() => {
        if (!registrationMessage && !registrationError) return;

        const timer = setTimeout(() => {
            setRegistrationMessage("");
            setRegistrationError("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [registrationMessage, registrationError]);

    // Closes the popup and resets the registration form.
    function closeRegisterPopup() {
        setIsRegisterPopupOpen(false);
        setRegistrationError("");
        setParticipantId("");
        setNote("");
    }

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (participantId === "") {
            setRegistrationError("Please select a participant.");
            return;
        }

        setIsSubmitting(true);
        setRegistrationError("");
        setRegistrationMessage("");

        const registration: CreateRegistration = {
            participantId,
            notes: note.trim() || undefined
        };

        try {
            const result = await registrationsService.create(
                eventId,
                registration
            );
            await loadEventDetails();
            setRegistrationsRefreshListKey((key) => key + 1);
            setRegistrationMessage(result.message);
            closeRegisterPopup();
        } catch (error) {
            if (error instanceof ApiError) {
                setRegistrationError(error.message);
            } else {
                setRegistrationError("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    // Refreshes event details and the registrations list after a status change.
    async function handleRegistrationChanged() {
        await loadEventDetails();
        setRegistrationsRefreshListKey((key) => key + 1);
    }

   // Calculate the percentage of capacity used by active registrations.
    const takenPercent = Math.min(
        100,
        Math.round((eventDetails.activeRegistrationCount / eventDetails.capacity) * 100)
    );


    if (isLoading) {
        return <p className="p-4 text-gray-500">Loading....</p>;
    }
    if(error){
        return <p className="p-4 text-red-600">{error}</p>;
    }
    if (!eventDetails) {
        return <p className=" p-4 text-red-600">Event not found</p>
    }

    return (
        <div className="min-h-screen  p-4 flex flex-col gap-2">
            {registrationMessage && (
                <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {registrationMessage}
                </p>
            )}


            {/* Event details Big card */}
            <div className="  bg-[#FAFAFA] border border-[#D8D8D8]  rounded-lg shadow-sm p-2 flex flex-col gap-1 ">
                <div className="flex flex-row justify-between">
                   <h1 className="text-[28px] font-bold text-[#4C1D95] ">
                       {eventDetails.name}
                   </h1>
                    <button
                        onClick={() => setIsRegisterPopupOpen(true)}
                        disabled={eventDetails.availableSeats === 0}
                        className="bg-[#4C1D95] hover:bg-[#3B1677] text-white text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4C1D95]"
                    >
                        Register participant
                    </button>
                </div>
                <div className="flex flex-row gap-2.5">
                    <div className=" bg-[#DBEAFE] text-[#1E40AF] text-xs font-semibold px-2.5 py-1 rounded-full ">{eventDetails.eventStatus}</div>
                    <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ eventDetails.isActive ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]" }`}>
                        {eventDetails.isActive? "Active" : "InActive"}</div>
                </div>
                {eventDetails.description?.trim() && (
                <div className="text-[15px] leading-[1.6] text-[#4B5563] max-w-[760px] mt-4">
                    {eventDetails.description}
                </div>
            )}
                <HorizontalLine></HorizontalLine>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 pt-5 mb-3">
                    <InfoEvent label="Category" value={eventDetails.categoryName} />
                    <InfoEvent label="Location" value={eventDetails.location} />
                    <InfoEvent label="Starts" value={formatDateTime(eventDetails.startAt)} />
                    <InfoEvent label="Ends" value={formatDateTime(eventDetails.endAt)} />
                    <InfoEvent
                        label="Registration deadline"
                        value={formatDateTime(eventDetails.registrationDeadline)}
                    />
                </div>
            </div>

            {/*Popup Register participant*/}
            {isRegisterPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl border border-[#D8D8D8] bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#4C1D95]">
                                Register Participant
                            </h2>

                            <button
                                type="button"
                                onClick={closeRegisterPopup}
                                className="text-2xl text-gray-500 hover:text-gray-800"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleRegister}
                            className="flex flex-col gap-4"
                        >
                            <SelectField
                                id="participant"
                                label="Participant"
                                required
                                value={participantId}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setParticipantId(value === "" ? "" : Number(value));
                                }}                            >
                                <option value="" disabled>
                                    Select a participant
                                </option>
                                <option value="1" >
                                    Lina Khalil
                                </option>
                                <option value="7" >
                                    Noor Samir
                                </option>
                            </SelectField>

                            <div>
                                <label
                                    htmlFor="registrationNotes"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Notes <span className="font-normal text-gray-400">(Optional)</span>
                                </label>

                                <textarea
                                    id="registrationNotes"
                                    name="notes"
                                    value={note}
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Enter notes..."
                                    className="w-full resize-none rounded-lg border border-[#D8D8D8] bg-white px-3 py-2 text-sm outline-none focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95]"
                                    onChange={(e)=>{setNote(e.target.value)}}
                                />

                                <p className="mt-1 text-right text-xs text-gray-400">
                                    Maximum 500 characters
                                </p>
                            </div>

                            {registrationError && (
                                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                    {registrationError}
                                </p>
                            )}
                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeRegisterPopup}
                                    className="rounded-xl border border-[#D8D8D8] px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm text-white hover:bg-[#3B1677] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Registering..." : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Event details small cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <StatusEventCard label="Capacity" value={eventDetails.capacity} />
                <StatusEventCard label="Active registrations" value={eventDetails.activeRegistrationCount} />
                <StatusEventCard
                    label="Available seats"
                    value={eventDetails.availableSeats}
                    valueClassName="text-[#166534]"
                    progress={takenPercent}
                />
            </div>

            {/* Registrations list with search, filters, and pagination */}
            <div className=" bg-[#FAFAFA] border border-[#D8D8D8] rounded-lg shadow-sm p-4">
                <RegistrationsList
                    eventId={eventId}
                    refreshKey={registrationsRefreshListKey}
                    onRegistrationChanged={handleRegistrationChanged}>
                </RegistrationsList>
            </div>
        </div>
    );
}
export default EventDetailsPage