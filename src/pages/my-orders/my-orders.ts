import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Select } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { timeInterval } from 'rxjs/operators';

/**
 * Generated class for the MyOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-my-orders',
    templateUrl: 'my-orders.html',
})
export class MyOrdersPage {

    itenbuttom: number = 0;
    itemsBuy: Observable<any[]>;
    bass: number;
    

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase, ) {

        if (this.navParams.get("item")) {
            this.itenbuttom = this.navParams.get("item");
        }

        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.itemsBuy = this.angularFireDatabase.list(`myoder/${data.uid}/menu`)
                .snapshotChanges()
                .map(caches => {
                    return caches.map(c => ({
                        key: c.payload.key, ...c.payload.val()
                    }));
                });
        });
        this.getNotData()
    }
    getNotData() {
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`myoder/${data.uid}/menu`).valueChanges()
                .subscribe(res => {
                    this.bass = res.length;
                })
        });
    }

    // formatDate() {
    //    const date1 = new Date();
    //    const date = date1.getDate();
    //    const year = date1.getFullYear();
    //    const month = date1.getMonth();
    //     return ``
    // }
    ionViewDidLoad() {
        console.log('ionViewDidLoad MyOrdersPage');
        console.log(this.ranbom(0, 1000000));

    }

    onTabpage() {
        this.navCtrl.setRoot('TabsPage');
    }

    ranbom(min_val, max_val) {
        return Math.floor(Math.random() * Math.floor(max_val - min_val + 1)) + min_val;
    }

    statusPage(item) {
        this.navCtrl.push('StatusPage', { item: item });
    }

}
