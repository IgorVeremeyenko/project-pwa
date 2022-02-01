import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
    
  currentMessage = new BehaviorSubject({});
  constructor() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received. ', payload);
      this.currentMessage.next(payload);      
      });
  }
  messaging = getMessaging();
  token = getToken(this.messaging, { vapidKey: 'BFXi_Wczk-SJrJ5Os4zs-UDXVXbdaPInEa0tXcUtRisuA1UCJaGbBRd3B05qWFUD9OUJj7kw19A-aAj1phd8U74' })
  .then((currentToken) => {
    
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      console.log(currentToken)
      return currentToken;
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
      return undefined;
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
    return undefined;
  });
   
  
}
