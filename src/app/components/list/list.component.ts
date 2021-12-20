import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Admin } from 'src/app/interfaces/admin';
import { Device } from 'src/app/interfaces/device';
import { GuardService } from 'src/app/services/guard.service';
import { AddToDetailsService } from 'src/app/services/add-to-details.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from 'src/app/dialogs/details/details.component';

class CustomPaginator extends MatPaginatorIntl {

  override itemsPerPageLabel = 'Показано результатов на странице';
  override nextPageLabel = 'Следующая страница'
  override previousPageLabel = 'Предыдущая страница'

  constructor() {
    super();
  }
}

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator }
  ]
})


export class ListComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
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

  parsed: any;
  name: any;
  length: number = 0;
  isShowing: boolean = false;
  loading: boolean = false;
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
    console.log(animationItem);
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
  ) {
    this.matIconRegistry.addSvgIcon('arrow', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'circle arrow.svg'))
    this.matIconRegistry.addSvgIcon('arrow-animated', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'loader-dark.svg'))
  }

  ngOnInit() {    
    
    const app = initializeApp(environment.firebaseConfig);
    if (app != null) {     
      console.log('app')
      this.clicked = true;
      this.sort.direction = 'desc'    
      // this.sortData(this.sort)    
      const currentUser = getAuth();
      console.log(currentUser)
      onAuthStateChanged(currentUser, async (user) => {
        if (user) {          
          this.isLoadingIcon = false;
          console.log('query to data service', user)
          console.log(user.phoneNumber)
          const phone = user.phoneNumber
          this.requirePermissions(phone!, user);
            //регистрация токена устройства
          return await user.getIdToken()
            .then((result) => {
              this.dataService.checkToken(result)
                .subscribe(() => {
                  this.dataService.message = true;                  
                  // this.isLogged = this.data.message;
                  setInterval(() => {
                    this.isLoadingIcon = false
                  }, 3000)
                })
              // this.isLogged = true; 
            })
          // ...
        } else {
          console.log('User is signed out');
          this.dataService.message = false;
          
          // this.isLogged = this.data.message;
          setInterval(() => {
            this.isLoadingIcon = false;
            // this.router.navigateByUrl('unauthorized');
          }, 3000)
          // User is signed out
          // this.isLogged = false;
          // this.message = "Вы не авторизованы"
        }
      });
    }
    else {
      console.log('app is null')
    }
    //this.getUsers();
  }

  requirePermissions(phone: string, user: any){
    
    this.dataService.requirePermissions(phone!)
    .subscribe((result: Admin[]) => {     
      this.dataService.getUsers()
      .subscribe(data => {
      this.clients = data;
      this.dataSource = new MatTableDataSource<Client>(this.clients);
      console.log('datasourse loaded', this.dataSource.data)
      this.update(true, phone);
      })
    }, error => {
      console.log('Error, вы не админ!')
      return this.dataService.getDevicesByUser(user.phoneNumber!)
      .subscribe((data: Device[]) => {
        console.log('loaded devices', data);
        this.devices = data;
        this.dataSource = new MatTableDataSource<Device>(this.devices);
        this.update(false, phone);
      }, error => {
        if(error.status == '404'){
          console.log("Не найден пользователь")
          this.alertMessage = "Вас ещё не зарегистрировали в нашей базе данных, либо Вы ещё не подавали заявки на ремонт"
        }
        else {
          console.log(error)
        }
      })
    })
  }

  getRecord(value: any){
    console.log(value)
    this.detailsService.addItem(value);
    // this.router.navigate(['details']);
    const dialogref = this.dialog.open(DetailsComponent, {
      data: value,
      restoreFocus: true
    })
    dialogref.afterClosed().subscribe((result) => {
      console.log('details closed ', result);
      if(result != undefined && result.data == 'fetched'){
        // this.getUsers();
      }
      
    })
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.sortedData);
    this.dataSource.paginator = this.paginator;
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
    this.loading = true;
    this.isShowing = false;
    this.noData = false;
    this.dataSource = new MatTableDataSource(this.sortedData);
    this.dataSource.paginator = this.paginator;
    if(admin){
      return this.dataService.getUsers()
      .subscribe(
        (data: Client[]) => {
          console.log(data)
          this.clients = data;
          this.length = data.length
          this.loading = false;
          this.isShowing = true;
          this.clicked = false;
          this.sortedData = this.clients.slice();
          this.dataSource = new MatTableDataSource(this.sortedData);
          this.dataSource.paginator = this.paginator;
        }, (error) => {
          console.log(error)
          this.isShowing = false;
          this.loading = false;
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
        console.log('loaded devices', data);
        this.devices = data;
        this.dataSource = new MatTableDataSource<Device>(this.devices);
      }, error => {
        console.log(error)
          this.isShowing = false;
          this.loading = false;
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

  sortData(sort: Sort) {
    console.log(this.clients)
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
