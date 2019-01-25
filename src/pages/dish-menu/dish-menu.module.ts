import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DishMenuPage } from './dish-menu';

@NgModule({
  declarations: [
    DishMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(DishMenuPage),
  ],
})
export class DishMenuPageModule {}
