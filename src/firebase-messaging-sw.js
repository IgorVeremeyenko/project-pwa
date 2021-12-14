importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

// Your web app's Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyAQyKGOGj6-WZD1IENAX1LynOz_GbERNw4",
  authDomain: "elite-service-92d53.firebaseapp.com",
  databaseURL: "https://elite-service-92d53-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "elite-service-92d53",
  storageBucket: "elite-service-92d53.appspot.com",
  messagingSenderId: "336956340236",
  appId: "1:336956340236:web:e62786b00809d449699629",
  measurementId: "G-QSF4E7NRMD"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then(function (registration) {
      // console.log("Service Worker Registered");
      messaging.useServiceWorker(registration);
    });
}