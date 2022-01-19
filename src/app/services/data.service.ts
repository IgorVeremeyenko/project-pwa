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
import { UserToken } from '../interfaces/user-token';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public url = "https://database.gopr-service.com.ua/api/ClientsDevices/"
  public urlSendMessage = "https://database.gopr-service.com.ua/api/Auth/"
  public urlPost = "https://database.gopr-service.com.ua/api/ClientsDevices/"
  public urlCheckUser = "https://database.gopr-service.com.ua/api/Clients/phone?phoneNumber="
  public urlChangeStatus = "https://database.gopr-service.com.ua/api/Devices/"
  public urlRequirePermissions = "https://database.gopr-service.com.ua/api/Admins/"  
  public urlTokens = "https://database.gopr-service.com.ua/api/Tokens"
  public urlGetToken = "https://database.gopr-service.com.ua/api/Tokens/"
  cache: Map<string, Observable<Client[]>> = new Map<string, Observable<Client[]>>();
  message: boolean = false;
  public token = new UserToken;

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

  registerTokenForUser(userToken: UserToken){   
    return this._http.post(this.urlTokens, userToken);
  }

  registerTokenForUserIfUserExists(userToken: UserToken){   
    return this._http.put(this.urlTokens, userToken);
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

  getTokenByPhone(phoneNumber: string){
    return this._http.get<UserToken>(this.urlGetToken + phoneNumber);
  }

  sendNotification(token: string, tech: string){
    
    const message = {
      Title: `Ваша техника готова: ${tech}`,
      Body: "Приезжайте, забирайте"
    }
    
    console.log('body ',message)
    return this._http.post(this.urlSendMessage + token, message);
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
