import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatusOrdersPage } from './status-orders';

@NgModule({
  declarations: [
    StatusOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(StatusOrdersPage),
  ],
})
export class StatusOrdersPageModule {}
