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
  show: boolean = false;
  currentDate!: Date;

  data: Notifications[] = [];

  constructor(private messagingService: MessagingService, private dataService: DataService) { }

  ngOnInit(): void {
    this.currentDate = new Date;
    
    this.dataService.readNotificationsFromDB().subscribe(() => {
      map((item: Notifications) => {
        if(this.dateDifference(item.dateToAdd, this.currentDate) > 1){
          item.isRead = false;
        }
        this.data.push(item);
      })
    })
    if(this.data.length == 0){
      this.show = false;
    }
    else {
      this.show = true;
    }
    this.message = this.messagingService.currentMessage;
    if(Object.keys(this.message.value).length > 0){
      console.log('msgobject : ', this.message)
    }    
  }

  dateDifference(start: Date, end: Date){
    return (end.getDate() - start.getDate());
  }

}
