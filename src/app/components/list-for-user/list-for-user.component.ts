import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { getMessaging, getToken } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { DetailsComponent } from 'src/app/dialogs/details/details.component';
import { Client } from 'src/app/interfaces/client';
import { Device } from 'src/app/interfaces/device';
import { AddToDetailsService } from 'src/app/services/add-to-details.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-for-user',
  templateUrl: './list-for-user.component.html',
  styleUrls: ['./list-for-user.component.scss']
})
export class ListForUserComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @Output() logged = new EventEmitter<boolean>();
  private path: string = "../../../assets/svg/";
  promiseLoadingRun = new BehaviorSubject<boolean>(true);
  clients!: Client[];
  devices!: Device[];
  loading = this.promiseLoadingRun.asObservable();
  filter!: Client;
  parsed: any;
  name: any;
  isPageLoaded: boolean = false;
  length: number = 0;
  isShowing: boolean = false;
  isLoadingIcon: boolean = false;
  noData: boolean = false;
  clicked: boolean = false;
  sortedData!: Client[];
  alertMessage: string = "";
  displayedColumns: string[] = [
    'created', 'device', 'status'
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private dataService: DataService,
    private mainFunction: AppComponent,
    private readonly router: Router,
    private readonly detailsService: AddToDetailsService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // this.clicked = true;
    this.sort.direction = 'desc'    
    // this.sortData(this.sort)    
    const currentUser = this.dataService.checkAuth();
    console.log(currentUser)
    onAuthStateChanged(currentUser!, async (user) => {
      if (user) {
        this.dataService.change(true);    
        this.mainFunction.onChanged(true);  
        this.isLoadingIcon = false;
        const phone = user.phoneNumber
        this.getDeviceToken();
        this.dataService.getDevicesByUser(user.phoneNumber!)
        .subscribe((data: Device[]) => {
          this.devices = data;
          this.promiseLoadingRun.next(false);
          this.dataSource = new MatTableDataSource<Device>(this.devices);
          // this.update(false, phone);
          this.isPageLoaded = true;
        }, error => {
          this.promiseLoadingRun.next(false);
          this.isPageLoaded = true;
          console.log(error)
          if(error.status === '404'){
            this.alertMessage = "Вас ещё не зарегистрировали в нашей базе данных, либо Вы ещё не подавали заявки на ремонт"
          }
          this.alertMessage = "Ошибка при загрузке..."
        })
      } else {
        this.dataService.change(false);  
        this.mainFunction.onChanged(false); 
        this.dataService.message = false;
        // this.isLogged = this.data.message;
        // this.loading$ = false;
        this.promiseLoadingRun.next(false);
        setInterval(() => {
          this.isLoadingIcon = false;
          this.isPageLoaded = true;
          this.router.navigateByUrl('authorization');
        }, 3000)
        // User is signed out
        // this.isLogged = false;
        // this.message = "Вы не авторизованы"
      }
    });

  //this.getUsers();
  }

  getDeviceToken(){
    const messaging = getMessaging();
    const vapidKey = environment.vapidKey;
    const myPhone = "tSJd7vpd:APA91bGyhfXFHd3_RQ5z5NJ311ObH2LcOP_dvZAZNTVcNUWG_hpWnaEFhrHjonnGukoRDScjTqSXh0zlCnyh_2qrwgh5XgWjyDZQvo-7Xi7_ht3Vm_3zPsdkG1L5AOn8usYnqJnRgngy"
    getToken(messaging, { vapidKey: vapidKey }).then((currentToken: any) => {
      if (currentToken) { 
        console.log(currentToken)
        
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

  getRecord(value: any){
    this.detailsService.addItem(value);
    // this.router.navigate(['details']);
    const dialogref = this.dialog.open(DetailsComponent, {
      data: value,
      restoreFocus: true
    })
    dialogref.afterClosed().subscribe((result) => {
      if(result != undefined && result.data == 'fetched'){
        // this.getUsers();
      }
      
    })
  }

  applyFilter(event: Event) {
        
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Client, filter: string) => {
      return data.client.name.toLocaleLowerCase().includes(filter) ||
      data.client.email.toLocaleLowerCase().includes(filter) ||
      data.client.phoneNumber.toLocaleLowerCase().includes(filter) ||
      data.device.deviceName.toLocaleLowerCase().includes(filter);

    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
  }

  sortData(sort: Sort) {
    // this.loading$ = true;
    this.promiseLoadingRun.next(false);
    const data = this.clients.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'status':
          return this.compareStatus(a.device.status, b.device.status, isAsc);
        case 'device':
          return this.compare(a.device.deviceName, b.device.deviceName, isAsc);
        case 'created':
          return this.compareDate(a.device.dateToAdd, b.device.dateToAdd, isAsc);
        default:
          return 0;
      }
    });
    this.sortedData = data;
    this.dataSource = new MatTableDataSource(this.sortedData);
    this.dataSource.paginator = this.paginator;
    // this.loading$ = false;
    this.promiseLoadingRun.next(false);
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {

    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  compareDate(a: Date, b: Date, isAsc: boolean) {
    const date1 = new Date(a)
    const date2 = new Date(b)
    return (date1.getDate() - date2.getDate()) * (isAsc ? 1 : -1);
  }
  compareStatus(a: boolean, b: boolean, isAsc: boolean) {
    return (a ? 1 : -1) * (isAsc ? 1 : -1)
  }

}