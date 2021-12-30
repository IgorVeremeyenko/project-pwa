import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../dialogs/login/login.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  path!: any;
  constructor(public dialog: MatDialog, private readonly router: Router) {
    this.path = this.router.getCurrentNavigation()?.extras.state
   }

  ngOnInit(): void {
    this.openDialog()
  }

  openDialog() {
    this.dialog.open(LoginComponent, {
      data: {
        animal: 'panda',
      },
      disableClose: true
    });
  }
}
