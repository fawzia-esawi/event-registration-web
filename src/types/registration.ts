
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
