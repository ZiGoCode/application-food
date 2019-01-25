import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DishPage } from './dish';

@NgModule({
  declarations: [
    DishPage,
  ],
  imports: [
    IonicPageModule.forChild(DishPage),
  ],
})
export class DishPageModule {}
