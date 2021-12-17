import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Admin } from '../interfaces/admin';
import { Client } from '../interfaces/client';
import { Device } from '../interfaces/device';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public url = "https://localhost:7214/api/ClientsDevices/"
  public urlTokenVerify = "https://localhost:7214/api/Auth/"
  public urlPost = "https://localhost:7214/api/ClientsDevices/"
  public urlCheckUser = "https://localhost:7214/api/Clients/phone?phoneNumber="
  public urlChangeStatus = "https://localhost:7214/api/Devices/"
  public urlRequirePermissions = "https://localhost:7214/api/Admins/"  
  message: boolean = false;
  token!: string;
  constructor(private _http: HttpClient) {
    
   }

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

  checkAuth(): boolean{
    const app = initializeApp(environment.firebaseConfig);
    if(app != null){
      const currentUser = getAuth();
      onAuthStateChanged(currentUser, (user) => {
        if(user) {
          console.log('is logged')
          return true;
        }
        return false;
      })
    }
    return false;
  }

}
