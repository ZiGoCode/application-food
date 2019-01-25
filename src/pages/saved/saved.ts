import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';


@IonicPage()
@Component({
    selector: 'page-saved',
    templateUrl: 'saved.html',
})
export class SavedPage {

    save: Observable<any[]>;
    bass: number;
    itenbuttom: number = 0;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private appCtrl: App
    ) {

        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.save = this.angularFireDatabase.list(`save/${data.uid}`)
                .snapshotChanges()
                .map(caches => {
                    return caches.map(c => ({
                        key: c.payload.key, ...c.payload.val()
                    }));
                });
        });
        this.getBaht();

        if (this.navParams.get("item")) {
            this.itenbuttom = this.navParams.get("item");
        }



    }

    getBaht() {
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`save/${data.uid}`).valueChanges()
                .subscribe(res => {
                    this.bass = res.length;
                })
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SavedPage');
    }

    dishPage(item) {
        this.appCtrl
            .getRootNav()
            .push("DishPage", { item: item, dishKey: item.key }, { animate: true, direction: "forward" });
    }

    delete(item) {
        let alert = this.alertCtrl.create({
            title: "Delete",
            message: "คุณแน่ใจหรือไม่ที่ต้องการลบเมนูอาหาร",
            buttons: [
                {
                    text: "ยกเลิก",
                    role: "cancel",
                    handler: () => { }
                },
                {
                    text: "ตกลง",
                    handler: () => {
                        const loader = this.loadingCtrl.create({
                            content: "Please wait...",
                            spinner: 'crescent',
                        });
                        loader.present();
                        this.angularFireAuth.authState.take(1).subscribe(data => {
                            this.angularFireDatabase
                                .list(`save/${data.uid}`)
                                .remove(item.key);
                        });
                        loader.dismiss();
                    }
                }
            ]
        });
        alert.present();
    }

}
