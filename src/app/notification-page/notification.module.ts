import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationPageComponent } from './notification-page.component';
import { NotificationRoutingModule } from './notification-routing.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    NotificationPageComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MaterialModule
  ]
})
export class NotificationModule { }