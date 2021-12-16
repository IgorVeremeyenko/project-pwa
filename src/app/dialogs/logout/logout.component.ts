import { Component, OnInit } from '@angular/core';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  auth = getAuth();
  logOut(){
    signOut(this.auth).then(() => {
      console.log('Sign-out successful.')
    }).catch((error) => {
      console.log('An error happened.')
    });
  }
}
