import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GoogleAuthProvider, getAuth, signInWithPopup, unlink } from "firebase/auth";
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './dialogs/login/login.component';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LogoutComponent } from './dialogs/logout/logout.component';
import { GuardService } from './services/guard.service';
import { DataService } from './services/data.service';
import { AnimationOptions } from 'ngx-lottie';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { map } from '@firebase/util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      // state('open', style({
      //   height: '60px',
      //   width: '60px',
      //   paddingRight: '0.5em'
      // })),
      // state('closed', style({
      //   height: '160px',
      //   width: '160px',
      //   paddingRight: '0.5em'
      // })),
      // transition('open => closed', [
      //   animate('0.5s')
      // ]),
      // transition('closed => open', [
      //   animate('0.5s')
      // ]),
      state('closed', style({ transform: 'rotate(0)' })),
      state('open', style({ transform: 'rotate(-360deg)' })),
      transition('open => closed', [
          animate('1s')
        ]),
        transition('closed => open', [
          animate('1s')
        ]),   
    ]),
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'project-pwa';
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }
  private pathSvg: string = "./assets/svg/";
  path!: any;
  // isLogged: boolean = false;
  isLogged = new BehaviorSubject<boolean>(false);

  
  isLoadingIcon: boolean = true;
  options: AnimationOptions = {
    path: './assets/svg/87164-loading-animation.json'    
  }
  constructor(
    private readonly router: Router,
    public dialog: MatDialog,
    private readonly authService: DataService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    
    this.matIconRegistry.addSvgIcon('arrow-animated', this.domSanitizer.bypassSecurityTrustResourceUrl(this.pathSvg + 'loader-dark.svg'));
    this.matIconRegistry.addSvgIcon('logo', this.domSanitizer.bypassSecurityTrustResourceUrl(this.pathSvg + 'logo-image-white.svg'))
  }
  ngAfterViewInit(): void {
    
  }

  home() {
    this.router.navigateByUrl('unauthorized');
  }
  list() {
    this.router.navigateByUrl('')
  }
  addUser(){
    this.router.navigateByUrl('add-client');
  }
  auth(){
    this.router.navigateByUrl('authorization')
  }
  Unlink() {
    const app = initializeApp(environment.firebaseConfig);
    const auth = getAuth();
    let provId: any;
    const providerId = auth.currentUser?.providerData
    providerId?.forEach((data) => {
      if(data.providerId != 'phone'){
        provId = data.providerId
      }

    })
    unlink(auth.currentUser!, provId).then(() => {
      this.router.navigateByUrl('devices');
    }).catch((error) => {
      console.log(error)
    });
  }

  ngOnInit(): void {
    console.log(this.isLogged.getValue())
    const app = initializeApp(environment.firebaseConfig);   
    // this.isLoadingIcon = true;   
    const user = this.authService.checkAuth();
    if(user != null){
      this.isLogged.next(true);
      // this.isLogged = true;
      this.isLoadingIcon = false;
    }
    else{
      // this.isLogged = false;
      this.isLogged.next(false);
      this.router.navigateByUrl('authorization');
    }
  }
  
  goLogin() {
    this.router.navigateByUrl('authorization');
  }

  logout() {
    const dialogRef = this.dialog.open(LogoutComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl('authorization');
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  singIn() {
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
