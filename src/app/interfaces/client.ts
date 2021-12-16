import { Device } from "./device";

export interface Client {
    id: number,
    phoneNumber: string,
    name: string,  
    email: string,
    client: Client,
    device: Device
}
