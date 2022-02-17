import { Client } from "./client";

export interface Notifications {
    id: number,
    dateToAdd: Date,
    title: string,
    body: string,
    isRead: boolean,
    clientID: number,
    client: Client
}
