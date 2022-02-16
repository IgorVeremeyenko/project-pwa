import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Notifications } from '../interfaces/notification';
import { DataService } from '../services/data.service';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent implements OnInit {

  message: any;
  show: boolean = true;
  currentDate!: Date;

  data: Notifications[] = [];

  constructor(private messagingService: MessagingService, private dataService: DataService) { }

  ngOnInit(): void {
    this.message = this.messagingService.currentMessage;
    if(Object.keys(this.message.value).length > 0){
      console.log('msgobject : ', this.message)
    }    
    this.currentDate = new Date;
    
    this.dataService.readNotificationsFromDB().subscribe((messages) => {      
      this.data = messages;
    })
    
    console.log('data of notifications: ',this.data);
    if(this.data.length == 0){
      //this.show = false;
      console.log(this.data);
    }
    else {
      console.log(this.data);

      this.show = true;
    }
  }

  dateDifference(start: Date, end: Date){
    return (end.getDate() - start.getDate());
  }

}