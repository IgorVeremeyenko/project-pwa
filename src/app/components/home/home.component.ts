import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
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
import { initializeApp } from 'firebase/app';
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
  users!: Client[];
  currentUser = getAuth();
  private token!: string;
  ELEMENT_DATA!: Client[];  
  isLogged: boolean = false;
  isLoadingIcon: boolean = false;
  alertMessage: string = "";
  options: AnimationOptions = {
    path: './assets/svg/87164-loading-animation.json'    
  }
  
  dataSource = new MatTableDataSource<Client>(this.users);
  displayedColumns = ['created', 'phone', 'device', 'status', 'email', 'name'];
  // clickedRows = new Set<Client>();
  constructor(breakpointObserver: BreakpointObserver,private readonly data: DataService,      
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly dataService: DataService,
    private readonly guardService: GuardService,
    private readonly detailsService: AddToDetailsService,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer
    ) { 
    breakpointObserver.observe(['(max-width: 800px)']).subscribe(result => {
      this.displayedColumns = result.matches ? 
          ['created', 'phone', 'device', 'status', 'email', 'name'] : 
          ['created', 'phone', 'device', 'status', 'email', 'name'];
    });
    iconRegistry.addSvgIconLiteral('calendar', sanitizer.bypassSecurityTrustHtml('src/assets/svg/event_note_black_24dp.svg'));
  }

  ngOnInit(): void {
    const app = initializeApp(environment.firebaseConfig);
    if (app != null) {

      const currentUser = getAuth();
      onAuthStateChanged(currentUser, async (user) => {
        if (user) {
          this.isLoadingIcon = false;
          console.log('query to data service', user)
          console.log(user.phoneNumber)
          const phone = user.phoneNumber
          this.dataService.requirePermissions(phone!)
            .subscribe((result: Admin[]) => {     
              this.guardService.isLoggedIn = true;
              this.dataService.getUsers()
              .subscribe(data => {
              this.users = data;
              this.dataSource = new MatTableDataSource<Client>(this.users);
              console.log('datasourse loaded', this.dataSource.data)
              })
            }, error => {
              console.log('Error, вы не админ!')
              this.guardService.isLoggedIn = false;
              return this.dataService.getDevicesByUser(user.phoneNumber!)
              .subscribe((data: Device[]) => {
                console.log('loaded devices', data);
                
              }, error => {
                if(error.status == '404'){
                  console.log("Не найден пользователь")
                  this.alertMessage = "Вас ещё не зарегистрировали в нашей базе данных, либо Вы ещё не подавали заявки на ремонт"
                }
                else {
                  console.log(error)
                }
              })
            })
          return await user.getIdToken()
            .then((result) => {
              this.dataService.checkToken(result)
                .subscribe(() => {
                  this.dataService.message = true;                  
                  this.isLogged = this.data.message;
                  setInterval(() => {
                    this.isLoadingIcon = false
                  }, 3000)
                })
              // this.isLogged = true; 
            })
          // ...
        } else {
          console.log('User is signed out');
          this.dataService.message = false;
          
          this.isLogged = this.data.message;
          setInterval(() => {
            this.isLoadingIcon = false
          }, 3000)
          // User is signed out
          // this.isLogged = false;
          // this.message = "Вы не авторизованы"
        }
      });
    }
    //this.getUsers();
    
  }

  getRecord(value: any){
    console.log(value)
    this.detailsService.addItem(value);
    // this.router.navigate(['details']);
    const dialogref = this.dialog.open(DetailsComponent, {
      data: value
    })
    dialogref.afterClosed().subscribe(() => {
      console.log('details closed')
    })
  }
  
  goNext(){
    this.router.navigateByUrl('table');
  }

  // logout(){
  //   const dialogRef = this.dialog.open(LogoutComponent);
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
      
  //   });
  // }

  enter(){
    console.log(this.token)
    signInWithCustomToken(this.currentUser, this.token)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log(user)
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
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

  getUsers(){
    this.data.getUsers()
    .subscribe((data: Client[]) => {
      this.users = data;
      const elements = this.users.slice()
      this.dataSource = new MatTableDataSource(elements)
      console.log(this.dataSource)
    })
  }
  // goLogin(){
  //   this.router.navigateByUrl('authorization');
  // }

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
