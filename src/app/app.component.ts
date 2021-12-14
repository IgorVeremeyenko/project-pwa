import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { DataService } from './services/data.service';
import { getMessaging, getToken } from "firebase/messaging";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project-pwa';
  titleToken: string = "";
  constructor(private readonly data: DataService){}
  ngOnInit(): void {
    const app = initializeApp(environment.firebaseConfig);
  }
  push(){
    const messaging = getMessaging();
    const myPhone = "tSJd7vpd:APA91bGyhfXFHd3_RQ5z5NJ311ObH2LcOP_dvZAZNTVcNUWG_hpWnaEFhrHjonnGukoRDScjTqSXh0zlCnyh_2qrwgh5XgWjyDZQvo-7Xi7_ht3Vm_3zPsdkG1L5AOn8usYnqJnRgngy"
    getToken(messaging, { vapidKey: 'BFXi_Wczk-SJrJ5Os4zs-UDXVXbdaPInEa0tXcUtRisuA1UCJaGbBRd3B05qWFUD9OUJj7kw19A-aAj1phd8U74' }).then((currentToken) => {
      if (currentToken) {
        this.titleToken = "send on my phone"
        this.data.checkToken(myPhone)
        .subscribe(t => console.log('SUCCESS', t))
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
  }
  
}
