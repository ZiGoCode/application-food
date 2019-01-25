import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StarsPage } from './stars';

@NgModule({
  declarations: [
    StarsPage,
  ],
  imports: [
    IonicPageModule.forChild(StarsPage),
  ],
})
export class StarsPageModule {}
