import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeComponent } from '../../components/home/home.component';
import { Client } from 'src/app/interfaces/client';
import { DataService } from 'src/app/services/data.service';
import { SnackBarComponent } from '../details/details.component';

@Component({
  selector: 'app-details-for-user',
  templateUrl: './details-for-user.component.html',
  styleUrls: ['./details-for-user.component.scss']
})
export class DetailsForUserComponent implements OnInit {

  ELEMENT_DATA!: Client;
  displayedColumns: string[] = ['created', 'phone', 'device', 'name', 'status', 'email'];
  dataSource = this.ELEMENT_DATA;
  public isLoading!: boolean;
  public value!: string;
  phone!: string;
  configSnackBar: MatSnackBarConfig = {
    panelClass: 'center',
    horizontalPosition: 'center', 
    verticalPosition: 'top',
    duration: 500,
    
  }
  constructor(public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    ) { 
      iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml('src/assets/svg/event_note_black_24dp.svg'));
    }

  ngOnInit(): void {
    this.phone = this.data.client.phoneNumber;
    console.log(this.phone)
    this.ELEMENT_DATA = this.data;
    this.dataSource = this.ELEMENT_DATA
    this.value = this.data.client.phoneNumber
  }
  onNoClick(): void {
    // this.openSnackBar("not sure", "Go!", {horizontalPosition: 'center', verticalPosition: 'top'})
    this.dialogRef.close();

  }
  openSnackBar(message: string, config: object) {
    const action = "";
    this._snackBar.open(message, action, config);
    
  }
  
  clipboard(){
    // this.configSnackBar.announcementMessage = 'Hello'
    this._snackBar.openFromComponent(SnackBarComponent, this.configSnackBar)
    
  }

}
