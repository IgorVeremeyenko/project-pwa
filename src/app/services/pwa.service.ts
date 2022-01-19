import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { take, timer } from 'rxjs';
import { PromptComponent } from '../prompt-component/prompt-component.component';
import { getMessaging, getToken } from "firebase/messaging";

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  private promptEvent: any;

  constructor(
    private bottomSheet: MatBottomSheet,
    private platform: Platform
  ) { }

  public initPwaPrompt() {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.promptEvent = event;
        this.getTokenMethod();
        this.openPromptComponent('android');
      });
    }
    if (this.platform.IOS) {
      const isInStandaloneMode = ('standalone' in window.navigator);
      if (!isInStandaloneMode) {
        this.getTokenMethod();
        this.openPromptComponent('ios');
      }
    }
  }

  private openPromptComponent(mobileType: 'ios' | 'android') {
    timer(3000)
      .pipe(take(1))
      .subscribe(() => this.bottomSheet.open(PromptComponent, { data: { mobileType, promptEvent: this.promptEvent } }));
  }
  private getTokenMethod(){
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'BFXi_Wczk-SJrJ5Os4zs-UDXVXbdaPInEa0tXcUtRisuA1UCJaGbBRd3B05qWFUD9OUJj7kw19A-aAj1phd8U74' }).then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log(currentToken);
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
