import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = "https://localhost:7214/api/ClientsDevices?phoneNumber=%2B380500868023"
  private urlTokenVerify = "https://localhost:7214/api/Auth/"
  private urlPost = "https://localhost:7214/api/ClientsDevices"
  private urlCheckUser = "https://localhost:7214/api/Clients/phone?phoneNumber="
  private urlChangeStatus = "https://localhost:7214/api/Devices/"
  constructor(private _http: HttpClient) { }

  checkToken(token: string){
    const data = {
      "body" : "Body",
      "title" : "Title"
  }
    return this._http.post(this.urlTokenVerify + token, data);
  }

}
