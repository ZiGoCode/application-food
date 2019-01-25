import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesRtrPage } from './messages-rtr';

@NgModule({
  declarations: [
    MessagesRtrPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagesRtrPage),
  ],
})
export class MessagesRtrPageModule {}
