import { Injectable } from '@angular/core';
import { getMessaging, onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  
  constructor() {
    // const messaging = getMessaging();
    // onBackgroundMessage(messaging, (payload) => {
    //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
    //   // Customize notification here
    //   const notificationTitle = 'Background Message Title';
    //   const notificationOptions = {
    //     body: 'Background Message body.',
    //     icon: '/firebase-logo.png'
    //   };

    //   // self.registration.showNotification(notificationTitle,
    //   //   notificationOptions);
    // });
    // onMessage(messaging, (payload) => {
    //   console.log('Message received. ', payload);
    //   // ...
    // });
  }
}
