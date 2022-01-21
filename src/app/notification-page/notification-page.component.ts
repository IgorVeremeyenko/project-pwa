import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent implements OnInit {

  message: any;

  constructor(private messagingService: MessagingService) { }

  ngOnInit(): void {
    this.message = this.messagingService.currentMessage
  }

}
