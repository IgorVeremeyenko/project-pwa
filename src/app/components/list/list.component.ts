import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, _MatPaginatorBase } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Client } from 'src/app/interfaces/client';
import { DataService } from 'src/app/services/data.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Admin } from 'src/app/interfaces/admin';
import { Device } from 'src/app/interfaces/device';
import { GuardService } from 'src/app/services/guard.service';
import { AddToDetailsService } from 'src/app/services/add-to-details.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from 'src/app/dialogs/details/details.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppComponent } from 'src/app/app.component';
import { slideInAnimation } from 'src/app/animations';
import { MessagingService } from 'src/app/services/messaging.service';

class CustomPaginator extends MatPaginatorIntl {

  override itemsPerPageLabel = 'Показано результатов на странице';
  override nextPageLabel = 'Следующая страница'
  override previousPageLabel = 'Предыдущая страница'
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    return ((page * pageSize) + 1) + ' - ' + ((page * pageSize) + pageSize) + ' из ' + length;
}
  constructor() {
    super();
  }
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator }
  ],
  animations: [
    // trigger('openClose', [
    //   state('closed', style({ transform: 'rotate(0)' })),
    //   state('open', style({ transform: 'rotate(-360deg)' })),
    //   transition('open => closed', [
    //       animate('1s')
    //     ]),
    //     transition('closed => open', [
    //       animate('1s')
    //     ]),   
    // ]),
    
  ],
})


export class ListComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @Output() logged = new EventEmitter<boolean>();
  private path: string = "../../../assets/svg/";
  clients!: Client[];
  devices!: Device[];
  currentUser = getAuth();
  private token!: string;
  ELEMENT_DATA!: Client[];  
  isLogged: boolean = false;
  isLoadingIcon: boolean = false;
  alertMessage: string = "";
  options: AnimationOptions = {
    path: './assets/svg/87164-loading-animation.json'    
  }
  promiseLoadingRun = new BehaviorSubject<boolean>(true);

  loading = this.promiseLoadingRun.asObservable();
  filter!: Client;
  parsed: any;
  name: any;
  isPageLoaded: boolean = false;
  length: number = 0;
  isShowing: boolean = false;
  // loading$: boolean = false;
  noData: boolean = false;
  clicked: boolean = false;
  sortedData!: Client[];
  displayedColumns: string[] = [
    'created', 'phone',
    'device', 'status',
    'email', 'name'
  ];
  dataSource = new MatTableDataSource<any>();
  
  // options: AnimationOptions = {
  //   path: '../assets/svg/Pre-comp.json',
  //   loop: true,
  //   autoplay: true
  // };

  animationCreated(animationItem: AnimationItem): void {
  }
  constructor(
    private dataService: DataService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef,
    private readonly guardService: GuardService,
    private readonly detailsService: AddToDetailsService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private mainFunction: AppComponent,
    private messages: MessagingService
  ) {
    this.matIconRegistry.addSvgIcon('arrow', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'circle arrow.svg'))
    this.matIconRegistry.addSvgIcon('arrow-animated', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'loader-dark.svg'))
  }
ngOnInit() {
  this.clicked = true;
  this.sort.direction = 'desc'    
  // this.sortData(this.sort)    
  let currentUser = this.dataService.checkAuth();
  console.log('current user ',currentUser)    
  if(!currentUser) currentUser = this.dataService.checkAuth();
  onAuthStateChanged(currentUser!, async (user) => {
    if (user) {    
      this.dataService.change(true);    
      this.mainFunction.onChanged(true);  
      this.isLoadingIcon = false;
      const phone = user.phoneNumber
      this.requirePermissions(phone!, user);
        //регистрация токена устройства
        const token = this.messages.token.then(res => {
          console.log('res token',res);
          this.dataService.token.phoneNumber = user.phoneNumber!;
          this.dataService.token.token = res;
          this.dataService.registerTokenForUser(this.dataService.token)
          .subscribe(result => {
            console.log('registar token: ', result);
          })
        })
      // ...
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

  onChangeAuth(event: boolean){
    this.logged.emit(event);
  }
  pushNotification(){
    this.dataService.sendNotification("f93bMtEKjCZ6runquJP9kC:APA91bHatSGU_zm5YDCDBlWk2iJ9vXOmShB2mFK-1GWppBgMzfLnNZ2G6TcIQaWK-dFjVJAdLBL1OTH6zZQc2lglQ6kx134UpKniww2vKuafqkzxbUPEvMRTBV_2HuScJY7ioGDrdLg7", "push from site!")
          .subscribe(t => console.log('send notification ', t), error => console.log('send notigication error ', error));
  }

  refreshTable(){
    this.dataService.clearCache();
    this.ngOnInit();
  }

  requirePermissions(phone: string, user: any){
    
    this.dataService.requirePermissions(phone!)
    .subscribe((result: Admin[]) => {     
      this.dataService.getUsers()
      .subscribe(data => {
      this.clients = data;
      this.dataSource = new MatTableDataSource<Client>(this.clients);
      this.promiseLoadingRun.next(false);
      this.update(true, phone);
      this.isPageLoaded = true;
      })
    }, error => {
      this.alertMessage = "Нет соединения с сервером"
      return this.dataService.getDevicesByUser(user.phoneNumber!)
      .subscribe((data: Device[]) => {
        
        this.devices = data;
        this.promiseLoadingRun.next(false);
        this.dataSource = new MatTableDataSource<Device>(this.devices);
        this.update(false, phone);
        this.isPageLoaded = true;
      }, error => {
        this.promiseLoadingRun.next(false);
        this.isPageLoaded = true;
        if(error.status == '404'){
          this.alertMessage = "Вас ещё не зарегистрировали в нашей базе данных, либо Вы ещё не подавали заявки на ремонт"
        }
      })
    })
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

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.sortedData);
    // this.dataSource.paginator = this.paginator;
  }
  // costumPaginator(){
  //   const customPaginatorIntl = new MatPaginatorIntl();

  //   customPaginatorIntl.itemsPerPageLabel = 'Custom_Label:';

  //   return customPaginatorIntl;
  // }


  // onPaginateChange(){
  //   this.dataSource.paginator = this.paginator;
  // }

  update(admin: boolean, phone: string) {
    this.clicked = true;
    // this.loading$ = true;
    this.promiseLoadingRun.next(true);
    this.isShowing = false;
    this.noData = false;
    this.dataSource = new MatTableDataSource(this.sortedData);
    this.dataSource.paginator = this.paginator;
    if(admin){
      return this.dataService.getUsers()
      .subscribe(
        (data: Client[]) => {
          this.promiseLoadingRun.next(false);
          this.clients = data;
          this.length = data.length
          // this.loading$ = false;
          this.promiseLoadingRun.next(false);
          this.isShowing = true;
          this.clicked = false;
          this.sortedData = this.clients.slice();
          this.dataSource = new MatTableDataSource(this.sortedData);
          this.dataSource.paginator = this.paginator;
        }, (error) => {
          this.isShowing = false;
          // this.loading$ = false;
          this.promiseLoadingRun.next(false);
          this.noData = true;
          this.clicked = false;
          this._snackBar.open('Что-то не так с соединением, попробуйте пожалуйста позже', 'Ок', {
            duration: 3000
          });
        })
    }
    else{
      return this.dataService.getDevicesByUser(phone)
      .subscribe((data: Device[]) => {
        this.promiseLoadingRun.next(false);
        this.devices = data;
        // this.loading$ = false;
        this.promiseLoadingRun.next(false);
        this.dataSource = new MatTableDataSource<Device>(this.devices);
      }, error => {
          this.isShowing = false;
          this.promiseLoadingRun.next(false);
          // this.loading$ = false;
          this.promiseLoadingRun.next(false);
          this.noData = true;
          this.clicked = false;
          this._snackBar.open('Что-то не так с соединением, попробуйте пожалуйста позже', 'Ок', {
            duration: 3000
          });
      })
    }    

  }

  // sortByDate(sort: Sort){
  //   const isAsc = sort.direction === 'asc';
  //   const data = this.sortedData.slice();
  //   console.log(sort)
  //   if (!sort.active || sort.direction === '') {
  //     return;
  //   }
  //   data.sort((a, b) => {
  //     const date1 = new Date(a.device.dateToAdd)
  //     const date2 = new Date(b.device.dateToAdd)      
  //     return (date2.getDate() - date1.getDate()) * (isAsc ? 1: -1);
  //   }) 

  //   console.log(data)   
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // applyFilter(event: Event) {
        
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filterPredicate = (data: Client, filter: string) => {
  //     return data.client.name.toLocaleLowerCase().includes(filter) ||
  //     data.client.email.toLocaleLowerCase().includes(filter) ||
  //     data.client.phoneNumber.toLocaleLowerCase().includes(filter) ||
  //     data.device.deviceName.toLocaleLowerCase().includes(filter);

  //   };
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
    
  // }


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
