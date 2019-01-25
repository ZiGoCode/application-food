import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

/**
 * Generated class for the OpenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-open',
  templateUrl: 'open.html',
})
export class OpenPage {
  items: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private angularFireAuth: AngularFireAuth,
    private angularFireDatabase: AngularFireDatabase,public actionsheetCtrl: ActionSheetController,
    public appCtrl: App) {

    this.angularFireAuth.authState.take(1).subscribe(data => {
      this.items = this.angularFireDatabase.list(`restaurantID/${data.uid}`).snapshotChanges().map(caches => {
        return caches.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }));
      });
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpenPage');
  }

  btedit(item) {
    this.navCtrl.push('EditRestaurantPage', { item: item })
  }

  editR(item) {

    const actionSheet = this.actionsheetCtrl.create({
      title: 'Modify your Restaurant',
      buttons: [
        {
          text: 'Up the Restaurant to FOODAPP',
          handler: () => {
            console.log('...');
          }
        }, {
          text: 'Edit',
          handler: () => {
            this.navCtrl.push('EditRestaurantPage', { item: item })
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.angularFireAuth.authState.take(1).subscribe(data => {
              this.angularFireDatabase.list(`restaurant/`).remove(item.key);
              this.angularFireDatabase.list(`restaurantID/${data.uid}`).remove(item.key);
              
            })
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  deleteR(item) {
    this.angularFireAuth.authState.take(1).subscribe(data => {
      this.angularFireDatabase.list(`restaurant/`).remove(item.key);
      this.angularFireDatabase.list(`restaurantID/${data.uid}`).remove(item.key);
    })
  }

  registerRtrPage(){
    this.appCtrl.getRootNav().push('RegisterRtrPage',{},{animate: true, direction: 'forward'});
  }

  registerDishPage(){
    this.appCtrl.getRootNav().push('RegisterDishPage',{},{animate: true, direction: 'forward'});
  }

}
