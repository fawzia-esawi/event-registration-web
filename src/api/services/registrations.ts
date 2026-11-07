import type {
    CreateRegistration,
    Registration
} from "../../types/registration.ts";
import {apiClient} from "../index.ts";
import type {PagedResult} from "../../types/common.ts";

export const  registrationsService = {

    getAll(eventId: number,page=1,pageSize=10,search?:string,status?:number):Promise<PagedResult<Registration>>{

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

        return apiClient.get<PagedResult<Registration>>(
            `/events/${eventId}/registrations?${params.toString()}`
        );
    },
    create(eventId:number,newRegistration:CreateRegistration):Promise<Registration>{
        return apiClient.post<Registration>(`/events/${eventId}/registrations`,newRegistration);
    },
    cancel(registrationId:number):Promise<Registration>{
        return apiClient.patch<Registration>(`/registrations/${registrationId}/cancel`)
    },

    getById(registrationId:number):Promise<Registration>{
        return apiClient.get<Registration>(`/registrations/${registrationId}`)
    }
   };