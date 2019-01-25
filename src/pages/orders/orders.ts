import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Baht } from '../../firebase/baht';

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {

    itemsBuy: Observable<any[]>;
    getDa: any;
    getnumber: any;
    itemid: Baht[] = [];
    statusid = new Array();
    bass: number;
    qty: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        public loadingCtrl: LoadingController,
        public appCtrl: App) {

        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.itemsBuy = this.angularFireDatabase.list(`buymenuid/${data.uid}/menu`)
                .snapshotChanges()
                .map(caches => {
                    return caches.map(c => ({
                        key: c.payload.key, ...c.payload.val()
                    }));
                });
        });
        this.getNotData();
        // this.getnumber = this.getData();
        // console.log(JSON.stringify(this.itemsBuy));

    }

    ionViewDidLoad() {

    }

    getNotData() {
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`buymenuid/${data.uid}/menu`).valueChanges()
                .subscribe(res => {
                    this.bass = res.length;
                    this.qty = res.length;
                    console.log('qty+',this.qty)
                    for (let i = 0; i < res.length; i++) {
                        this.getDa = res[i];
                        const data = this.getDa.status;
                        const data1 = "สำเร็จ";
                        console.log('Status',data,data1);
                        if (data == data1) {
                            this.qty = Number(this.qty - 1);  
                        }
                    }
                    console.log('qty--',this.qty)
                });
        });
    }

    status(item) {
        this.appCtrl.getRootNav().push('StatusOrdersPage', { item: item, key: item.key }, { animate: true, direction: 'forward' });
    }


}
export interface numberid {
    itemid: any;
}