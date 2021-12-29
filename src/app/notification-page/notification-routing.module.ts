import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { NotificationPageComponent } from './notification-page.component';
import { NotificationModule } from './notification.module';

const routes: Routes = [{ path: '', component: NotificationPageComponent, data: { animation: 'isRight' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
