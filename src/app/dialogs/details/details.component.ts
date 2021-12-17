import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeComponent } from 'src/app/components/home/home.component';
import { Client } from 'src/app/interfaces/client';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  ELEMENT_DATA!: Client;
  displayedColumns: string[] = ['created', 'phone', 'device', 'name', 'status', 'email'];
  dataSource = this.ELEMENT_DATA;
  public isLoading!: boolean;
  
  constructor(public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar
    ) { 
      iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml('src/assets/svg/event_note_black_24dp.svg'));
    }

  ngOnInit(): void {
    console.log(this.data.device.status)
    this.ELEMENT_DATA = this.data;
    this.dataSource = this.ELEMENT_DATA
  }
  onNoClick(): void {
    // this.openSnackBar("not sure", "Go!", {horizontalPosition: 'center', verticalPosition: 'top'})
    this.dialogRef.close();

  }
  openSnackBar(message: string, action: string, config: object) {
    this._snackBar.open(message, action, config);
  }
  fetch(){
    this.isLoading = !this.isLoading;
    console.log('fetching')
  }

}
