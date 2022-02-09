import { Component, OnInit } from '@angular/core';
import { Notification } from '../interfaces/notification';
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

  data: Notification[] = [];

  constructor(private messagingService: MessagingService, private dataService: DataService) { }

  ngOnInit(): void {
    this.message = this.messagingService.currentMessage;
    if(Object.keys(this.message.value).length > 0){
      this.show = true;
      this.currentDate = new Date;
      console.log('msgobject : ', this.message)
    }
    
  }

}
