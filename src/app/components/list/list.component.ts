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
  @ViewChild(MatSort) sort!: MatSort;
  private path: string = "../../../assets/svg/";
  clients!: Client[];

  displayedColumns = ['item', 'cost'];
  transactions: Transaction[] = [
    {item: 'Beach ball', cost: 4},
    {item: 'Towel', cost: 5},
    {item: 'Frisbee', cost: 2},
    {item: 'Sunscreen', cost: 4},
    {item: 'Cooler', cost: 25},
    {item: 'Swim suit', cost: 15},
  ];

  parsed: any;
  name: any;
  length: number = 0;
  isShowing: boolean = false;
  loading: boolean = false;
  noData: boolean = false;
  clicked: boolean = false;
  sortedData!: Client[];
  // displayedColumns: string[] = [
  //   'created', 'phone',
  //   'device', 'status',
  //   'email', 'name'
  // ];
  dataSource = new MatTableDataSource<Client>(this.clients);

  options: AnimationOptions = {
    path: '../assets/svg/Pre-comp.json',
    loop: true,
    autoplay: true
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
  constructor(
    private dataService: DataService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.matIconRegistry.addSvgIcon('arrow', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'circle arrow.svg'))
    this.matIconRegistry.addSvgIcon('arrow-animated', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'loader-dark.svg'))
  }

  ngOnInit() {
    this.update()
    this.clicked = true;
    this.sort.direction = 'desc'
    this.sortData(this.sort)
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

  update() {
    this.clicked = true;
    this.loading = true;
    this.isShowing = false;
    this.noData = false;
    this.dataSource = new MatTableDataSource(this.sortedData);
    this.dataSource.paginator = this.paginator;
    return this.dataService.getUsers()
      .subscribe(
        (data: Client[]) => {
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
