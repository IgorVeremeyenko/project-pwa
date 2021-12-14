import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { DataService } from './services/data.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { MessagingService } from './services/messaging.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project-pwa';
  titleToken: string = "";
  
  constructor(private readonly data: DataService, private messages: MessagingService){}
  ngOnInit(): void {
    const app = initializeApp(environment.firebaseConfig);
    if(app != null)
    {
      const msg = this.messages;
      const messaging = getMessaging();
      
      // onMessage(messaging, (payload) => {
      //   console.log('Message received. ', payload);
      //   // ...
      // });
    }
  }
  push(){
    const messaging = getMessaging();
    const vapidKey = environment.vapidKey;
    const myPhone = "tSJd7vpd:APA91bGyhfXFHd3_RQ5z5NJ311ObH2LcOP_dvZAZNTVcNUWG_hpWnaEFhrHjonnGukoRDScjTqSXh0zlCnyh_2qrwgh5XgWjyDZQvo-7Xi7_ht3Vm_3zPsdkG1L5AOn8usYnqJnRgngy"
    getToken(messaging, { vapidKey: vapidKey }).then((currentToken) => {
      if (currentToken) {
        this.titleToken = "send .. here!"
        this.data.checkToken(currentToken)
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

  singIn(){
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    auth.languageCode = 'it';
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential!.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(token)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }
  
}
