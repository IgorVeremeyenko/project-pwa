import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientsDevice } from '../components/add-client/add-client.component';
import { Admin } from '../interfaces/admin';
import { Client } from '../interfaces/client';
import { Device } from '../interfaces/device';
import * as CryptoJS from "crypto-js"

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
  cache: Map<string, Observable<Client[]>> = new Map<string, Observable<Client[]>>();
  message: boolean = false;
  token!: string;

  private getMd5(obj: any): string {
    const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(obj));
    return hash.toString();
  }

  private cashGet(url: string): Observable<Client[]> | undefined{
    const getHash = this.getMd5(url);
    const getCache = this.cache.get(getHash)
    if( getCache != undefined){
      console.log('from hash')
      return getCache;
    }
    return undefined;
  }

  @Output() onChanged = new EventEmitter<boolean>();
  constructor(private _http: HttpClient) {
    
  }

  change(increased:any) {
    this.onChanged.emit(increased);
  }

  clearCache(){
    this.cache.clear();   
    console.log(this.cache) 
  }

  registerTokenForUser(token: string, user: Client){
  
    return this._http.post(this.urlTokenVerify + token, user);
  }
  getUsers() {
    console.log(this.cache)
    const cash = this.cashGet(this.url)
    if(cash != undefined){
      return cash!
    }
    else {
      const dataHash = this.getMd5(this.url)
      return this._http.get<Client[]>(this.url)
      .pipe(tap(data => {
        if(this.cache.size < 1){
          this.cache.set(dataHash, of(data))
        }          
      }
      ));
    }
  }

  requirePermissions(phoneNumber: string){
    return this._http.get<Admin[]>(this.urlRequirePermissions + phoneNumber);
  }

  getDevicesByUser(phone: string){
    return this._http.get<Device[]>(this.urlPost + phone);
  }

  setStatusTrue(id: number, item: Device){
    return this._http.put<Device>(this.urlChangeStatus + id, item);
  }

  checkAuth(): Auth | null{
    const app = initializeApp(environment.firebaseConfig)
    if(app != null){
      const currentUser = getAuth();
      return currentUser;
    }
    return null;
  }

  addUser(newClient: ClientsDevice){
    console.log(newClient)
    return this._http.post<Client[]>(this.urlPost, newClient);
  }
  

}
