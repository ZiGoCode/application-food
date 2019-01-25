import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the StarsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stars',
  templateUrl: 'stars.html',
})
export class StarsPage {
  element1: any;
  price: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private angularFireAuth: AngularFireAuth,
    private angularFireDatabase: AngularFireDatabase) {

    this.getData();
    this.price = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StarsPage');
  }

  getData() {
    this.angularFireAuth.authState.take(1).subscribe(data => {
      this.angularFireDatabase.list(`buymenuid/${data.uid}/menu`).valueChanges()
        .subscribe(res => {
          this.price = 0
          for (let index = 0; index < res.length; index++) {
            this.element1 = res[index];
            this.price += Number(this.element1.baht);
          }
        });
    });
  }
}
