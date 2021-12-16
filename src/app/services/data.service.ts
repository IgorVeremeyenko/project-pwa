import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Admin } from '../interfaces/admin';
import { Client } from '../interfaces/client';
import { Device } from '../interfaces/device';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = "https://localhost:7214/api/ClientsDevices/"
  private urlTokenVerify = "https://localhost:7214/api/Auth/"
  private urlPost = "https://localhost:7214/api/ClientsDevices/"
  private urlCheckUser = "https://localhost:7214/api/Clients/phone?phoneNumber="
  private urlChangeStatus = "https://localhost:7214/api/Devices/"
  private urlRequirePermissions = "https://localhost:7214/api/Admins/"
  message: boolean = false;
  token!: string;
  constructor(private _http: HttpClient) { }

  checkToken(token: string){
    const data = {
      "body" : "Body",
      "title" : "Title"
  }
  const requestOptions: Object = {   
    responseType: 'text'
  }
    return this._http.post(this.urlTokenVerify + token, data, requestOptions);
  }
  getUsers() {
    return this._http.get<Client[]>(this.url);
  }

  requirePermissions(phoneNumber: string){
    return this._http.get<Admin[]>(this.urlRequirePermissions + phoneNumber);
  }

  getDevicesByUser(phone: string){
    return this._http.get<Device[]>(this.urlPost + phone);
  }

}
