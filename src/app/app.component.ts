import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GoogleAuthProvider, getAuth, signInWithPopup, unlink } from "firebase/auth";
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './dialogs/login/login.component';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { LogoutComponent } from './dialogs/logout/logout.component';
import { GuardService } from './services/guard.service';
import { DataService } from './services/data.service';
import { AnimationOptions } from 'ngx-lottie';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { slideInAnimation } from './animations';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'GOPR-SERVICE';
  isOpen = true;
  matches: boolean = false;
  private pathSvg: string = "./assets/svg/";
  public messagesCount = 0;
  path!: any;
  isLogged = new BehaviorSubject<boolean>(false);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  isLoadingIcon: boolean = true;
  options: AnimationOptions = {
    path: './assets/svg/87164-loading-animation.json'
  }
  constructor(
    private readonly router: Router,
    public dialog: MatDialog,
    private readonly authService: DataService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,
    public breakpointObserver: BreakpointObserver
  ) {

    this.matIconRegistry.addSvgIcon('arrow-animated', this.domSanitizer.bypassSecurityTrustResourceUrl(this.pathSvg + 'loader-dark.svg'));
    this.matIconRegistry.addSvgIcon('logo', this.domSanitizer.bypassSecurityTrustResourceUrl(this.pathSvg + 'logo-image-white.svg'))
  }
  ngAfterViewInit(): void {

  }

  goToNotifications(){
    this.router.navigateByUrl('notifications')
  }

  onChanged(increased: any) {
    increased == true ? this.isLogged.next(true) : this.isLogged.next(false);
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }

  home() {
    this.router.navigateByUrl('unauthorized');
  }
  list() {
    this.router.navigateByUrl('')
  }
  addUser() {
    this.router.navigateByUrl('add-client');
  }
  auth() {
    this.router.navigateByUrl('authorization')
  }
  listForUser(){
    this.router.navigateByUrl('list');
  }
  Unlink() {
    const auth = this.dataService.checkAuth();
    let provId: any;
    const providerId = auth!.currentUser?.providerData
    providerId?.forEach((data) => {
      if (data.providerId != 'phone') {
        provId = data.providerId
      }

    })
    unlink(auth!.currentUser!, provId).then(() => {
      this.router.navigateByUrl('devices');
    }).catch((error) => {
      console.log('error devices',error)
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  ngOnInit(): void {
    // const app = initializeApp(environment.firebaseConfig);   
    // this.isLoadingIcon = true;  
    this.breakpointObserver.observe(['(min-width: 830px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.matches = true;
      } else {
        this.matches = false;
      }
    });
    const user = this.authService.checkAuth();
    if (user != null) {
      // this.isLogged.next(true);
      console.log('user is logged',this.isLogged)
      // this.isLogged = true;
      this.isLoadingIcon = false;
    }
    else {
      // this.isLogged = false;
      // this.isLogged.next(false);
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
