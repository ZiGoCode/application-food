import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterDishPage } from './register-dish';

@NgModule({
  declarations: [
    RegisterDishPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterDishPage),
  ],
})
export class RegisterDishPageModule {}
