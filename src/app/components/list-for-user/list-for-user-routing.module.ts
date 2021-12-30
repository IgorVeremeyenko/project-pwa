import { NgModule } from '@angular/core';
import { ListForUserComponent } from './list-for-user.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ListForUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListForUserRoutingModule { }
