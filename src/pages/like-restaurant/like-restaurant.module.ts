import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LikeRestaurantPage } from './like-restaurant';

@NgModule({
  declarations: [
    LikeRestaurantPage,
  ],
  imports: [
    IonicPageModule.forChild(LikeRestaurantPage),
  ],
})
export class LikeRestaurantPageModule {}
