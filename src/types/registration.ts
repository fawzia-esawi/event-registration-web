
export interface Registration{
 id :number;

 eventId:number;

 eventName:string;

 participantId:number;

 participantName:string;

 participantEmail:string;

 participantPhone:string;

 status:number;

 statusName :string;

 notes:string | null;

 registeredAt:string;

 cancelledAt:string|null;
}
export interface RegistrationResponse {
    items: Registration[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface CreateRegistration{
    participantId:number;
    notes?:string;
}
export interface ResponseCreateRegistration{
    id:number;
    message:string;
}
export interface RegistrationDetails{
    id :number;

    eventId:number;

    participantName:string;

    status:number;

    notes:string | null;

    registeredAt:string;

    cancelledAt:string|null;

}