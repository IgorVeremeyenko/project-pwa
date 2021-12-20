import { Component, ContentChild, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeComponent } from '../../components/home/home.component';
import { Client } from 'src/app/interfaces/client';
import { DataService } from 'src/app/services/data.service';
import { SureComponent } from '../sure/sure.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {

  ELEMENT_DATA!: Client;
  displayedColumns: string[] = ['created', 'phone', 'device', 'name', 'status', 'email'];
  dataSource = this.ELEMENT_DATA;
  public isLoading!: boolean;
  public value!: string;
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
    private readonly dialog: MatDialog,
    private readonly dataService: DataService,
    ) { 
      iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml('src/assets/svg/event_note_black_24dp.svg'));
    }

  ngOnInit(): void {
    console.log(this.data.device.status)
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
  fetch(){    
    const dialogRef = this.dialog.open(SureComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        console.log(`Dialog result: ${result}`);
        this.isLoading = !this.isLoading;
        const device = this.data.device
        device.status = true;
        this.dataService.setStatusTrue(this.data.device.id, device)
        .subscribe((result) => {
          console.log('fetched success ', result);
          this.isLoading = !this.isLoading;
          this.dialogRef.close({data: 'fetched'});
        }, error => {
          console.log(error);
          this.isLoading = !this.isLoading;
          this.configSnackBar.duration = 5000
          this.openSnackBar("Не удалось отправить уведомление", this.configSnackBar);
          this.dialogRef.close({data: 'notFetched'})
        })
      }
      else {
        return;
      }
    })
  }
  clipboard(){
    // this.configSnackBar.announcementMessage = 'Hello'
    this._snackBar.openFromComponent(SnackBarComponent, this.configSnackBar)
    
  }

}

@Component({
  selector: 'snack-bar-component-example',
  templateUrl: 'snack-bar-component-example.html',
  encapsulation: ViewEncapsulation.None
})
export class SnackBarComponent {}
