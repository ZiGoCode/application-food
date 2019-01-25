import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-status',
    templateUrl: 'status.html',
})
export class StatusPage {

    tomorrow: any;
    bass: number;
    itemMyOrder: Observable<any[]>;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase, ) {

        // this.tomorrow = new Date().toLocaleString();
        this.tomorrow = this.navParams.get('item')
        console.log(this.tomorrow.key);

        this.angularFireAuth.authState
            .take(1)
            .subscribe(data => {
                this.itemMyOrder = this.angularFireDatabase
                    .list(`myoder/${data.uid}/menu/${this.tomorrow.key}/statu`).valueChanges();
            });

        this.getColor();
        
    }

    getColor() {
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`myoder/${data.uid}/menu/${this.tomorrow.key}/statu`).valueChanges()
                .subscribe(res => {
                    this.bass = res.length;
                });
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StatusPage');
    }

}
