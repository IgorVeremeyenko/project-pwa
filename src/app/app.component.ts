import { Component,  OnInit  } from '@angular/core';
import { GoogleAuthProvider, getAuth, signInWithPopup  } from "firebase/auth";
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './dialogs/login/login.component';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project-pwa';
  
  constructor(
    
    public dialog: MatDialog

  ) { }  

  ngOnInit(): void {
    const app = initializeApp(environment.firebaseConfig);
    
  }

  

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
