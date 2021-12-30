import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCustomToken, signInWithPopup } from 'firebase/auth';
import { getMessaging, getToken } from 'firebase/messaging';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { Client } from 'src/app/interfaces/client';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationStyleMetadata } from '@angular/animations';
import { Admin } from 'src/app/interfaces/admin';
import { Device } from 'src/app/interfaces/device';
import { GuardService } from 'src/app/services/guard.service';
import { AddToDetailsService } from 'src/app/services/add-to-details.service';
import { DetailsComponent } from 'src/app/dialogs/details/details.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  titleToken: string = "";

  constructor(breakpointObserver: BreakpointObserver,private readonly data: DataService,      
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly dataService: DataService,
    private readonly guardService: GuardService,
    private readonly detailsService: AddToDetailsService,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer
    ) {     
    iconRegistry.addSvgIconLiteral('calendar', sanitizer.bypassSecurityTrustHtml('src/assets/svg/event_note_black_24dp.svg'));
  }

  ngOnInit(): void {
    console.log('home component')   
    
  }

  push(){
    const messaging = getMessaging();
    const vapidKey = environment.vapidKey;
    const myPhone = "tSJd7vpd:APA91bGyhfXFHd3_RQ5z5NJ311ObH2LcOP_dvZAZNTVcNUWG_hpWnaEFhrHjonnGukoRDScjTqSXh0zlCnyh_2qrwgh5XgWjyDZQvo-7Xi7_ht3Vm_3zPsdkG1L5AOn8usYnqJnRgngy"
    getToken(messaging, { vapidKey: vapidKey }).then((currentToken: any) => {
      if (currentToken) { 
        this.titleToken = "send .. here!"
        
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err: any) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
  }
}
