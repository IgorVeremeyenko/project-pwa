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
  msgObject: Notification = {
    id: 0,
    phoneNumber: '',
    date: new Date,
    title: '',
    body: '',
    img: ''
  }

  data: Notification[] = [];

  constructor(private messagingService: MessagingService, private dataService: DataService) { }

  ngOnInit(): void {
    this.message = this.messagingService.currentMessage;
    if(Object.keys(this.message.value).length > 0){
      this.show = true;
      this.msgObject = this.message;
      const user = this.dataService.checkAuth();
      const number = user?.currentUser?.phoneNumber;
      this.msgObject.phoneNumber = number!;
      this.dataService.addNotificationToDataBase(this.msgObject);
    }
    
  }

}
