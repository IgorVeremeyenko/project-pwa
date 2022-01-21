importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
import { getMessaging, onMessage } from "firebase/messaging";

const messaging = getMessaging();

onMessage(messaging, (payload) => {
console.log('Message received. ', payload);
    
});