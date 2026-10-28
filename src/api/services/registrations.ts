import type {
    CreateRegistration,
    RegistrationDetails,
    RegistrationResponse,
    ResponseCreateRegistration
} from "../../types/registration.ts";
import {apiClient} from "../client.ts";

export const  registrationsService = {

    getAll(eventId: number,page=1,pageSize=10,search?:string,status?:number):Promise<RegistrationResponse>{

        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
        });

        if (search?.trim()) {
            params.set("search", search.trim());
        }

        if (status !== undefined) {
            params.set("status", String(status));
        }

        return apiClient.get<RegistrationResponse>(
            `/events/${eventId}/registrations?${params.toString()}`
        );
    },
    create(eventId:number,newRegistration:CreateRegistration):Promise<ResponseCreateRegistration>{
        return apiClient.post<ResponseCreateRegistration>(`/events/${eventId}/registrations`,newRegistration);
    },
    cancel(registrationId:number):Promise<ResponseCreateRegistration>{
        return apiClient.patch<ResponseCreateRegistration>(`/registrations/${registrationId}/cancel`)
    },

    getById(registrationId:number):Promise<RegistrationDetails>{
        return apiClient.get<RegistrationDetails>(`/registrations/${registrationId}`)
    }
   };