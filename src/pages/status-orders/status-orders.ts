import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { Baht } from '../../firebase/baht';
import { Status } from '../../firebase/status';


@IonicPage()
@Component({
    selector: 'page-status-orders',
    templateUrl: 'status-orders.html',
})
export class StatusOrdersPage {

    itemsBuy: Observable<any[]>;
    bahtDish = {} as Baht;
    keyid: string;
    isenabled: boolean = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        private toastCtrl: ToastController,
        public loadingCtrl: LoadingController) {

        this.keyid = this.navParams.get("key");
        this.bahtDish = this.navParams.get("item");
        if (this.bahtDish.status == 'สำเร็จ') {
            this.isenabled = false;
        }

        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.itemsBuy = this.angularFireDatabase.list(`buymenuid/${data.uid}/menu/${this.keyid}/dish/`)
                .snapshotChanges()
                .map(caches => {
                    return caches.map(c => ({
                        key: c.payload.key, ...c.payload.val()
                    }));
                });
        });

        console.log(this.keyid);

    }
    statusUpdate(bahtDish: Baht, item) {
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: 'crescent',
        });
        loader.present();
        let toast = this.toastCtrl.create({
            message: 'อัพเดทสถาณะเรียบร้อยเเล้ว',
            duration: 2000,
            position: 'top'
        });
        const statu = {} as Status;
        const color = {} as Baht;
        statu.status = bahtDish.status;
        statu.date = new Date().toLocaleString();

        if (statu.status == 'ได้รับออเดอร์แล้ว') {
            console.log('ได้รับออเดอร์แล้ว true')
            color.ioconcolor = 'danger6';
            statu.color = 'danger6';
            this.angularFireAuth.authState
                .take(1)
                .subscribe(data => {
                    this.angularFireDatabase.list(`buymenuid/${data.uid}/menu/`)
                        .update(this.keyid, { ioconcolor: color.ioconcolor });
                });
            this.angularFireDatabase
                .list(`myoder/${bahtDish.keyuser}/menu/`)
                .update(bahtDish.idoder, { ioconcolor: color.ioconcolor });
            console.log(color.ioconcolor)
        }
        if (statu.status == 'ตรวจสอบเมนูทั้งหมดแล้ว') {
            console.log('ตรวจสอบเมนูทั้งหมดแล้ว true')
            color.ioconcolor = 'danger3';
            statu.color = 'danger3';
            this.angularFireAuth.authState
                .take(1)
                .subscribe(data => {
                    this.angularFireDatabase.list(`buymenuid/${data.uid}/menu/`)
                        .update(this.keyid, { ioconcolor: color.ioconcolor });
                });
            this.angularFireDatabase
                .list(`myoder/${bahtDish.keyuser}/menu/`)
                .update(bahtDish.idoder, { ioconcolor: color.ioconcolor });
            console.log(color.ioconcolor)
        }
        if (statu.status == 'กำลังปรุ่งอาหาร') {
            console.log('กำลังปรุ่งอาหาร true')
            color.ioconcolor = 'primary';
            statu.color = 'primary';
            this.angularFireAuth.authState
                .take(1)
                .subscribe(data => {
                    this.angularFireDatabase.list(`buymenuid/${data.uid}/menu/`)
                        .update(this.keyid, { ioconcolor: color.ioconcolor });
                });
            this.angularFireDatabase
                .list(`myoder/${bahtDish.keyuser}/menu/`)
                .update(bahtDish.idoder, { ioconcolor: color.ioconcolor });
            console.log(color.ioconcolor)

        }
        if (statu.status == 'รอเสิร์ฟอาหาร') {
            console.log('รอเสิร์ฟอาหาร true')
            color.ioconcolor = 'secondary';
            statu.color = 'secondary';
            this.angularFireAuth.authState
                .take(1)
                .subscribe(data => {
                    this.angularFireDatabase.list(`buymenuid/${data.uid}/menu/`)
                        .update(this.keyid, { ioconcolor: color.ioconcolor });
                });
            this.angularFireDatabase
                .list(`myoder/${bahtDish.keyuser}/menu/`)
                .update(bahtDish.idoder, { ioconcolor: color.ioconcolor });
            console.log(color.ioconcolor)

        }
        if (statu.status == 'สำเร็จ') {
            console.log('สำเร็จ true')
            color.ioconcolor = 'secon';
            statu.color = 'secon';
            this.angularFireAuth.authState
                .take(1)
                .subscribe(data => {
                    this.angularFireDatabase.list(`buymenuid/${data.uid}/menu/`)
                        .update(this.keyid, { ioconcolor: color.ioconcolor });
                });
            this.angularFireDatabase
                .list(`myoder/${bahtDish.keyuser}/menu/`)
                .update(bahtDish.idoder, { ioconcolor: color.ioconcolor });
            console.log(color.ioconcolor)
        }


        this.angularFireAuth.authState
            .take(1)
            .subscribe(data => {
                this.angularFireDatabase
                    .list(`buymenuid/${data.uid}/menu/`)
                    .update(this.keyid, { status: statu.status });
            });
        this.angularFireDatabase
            .list(`myoder/${bahtDish.keyuser}/menu/${bahtDish.idoder}/statu`)
            .push(statu);
        this.angularFireDatabase
            .list(`myoder/${bahtDish.keyuser}/menu/`)
            .update(bahtDish.idoder, { status: statu.status });

        loader.dismiss();
        toast.present();
        this.navCtrl.pop();
    }

    // getData() {
    //     this.angularFireAuth.authState.take(1).subscribe(data => {
    //         this.itemsBuy = this.angularFireDatabase.list(`buymenuid/${data.uid}/menu/dish`)
    //             .snapshotChanges()
    //             .map(caches => {
    //                 return caches.map(c => ({
    //                     key: c.payload.key, ...c.payload.val()
    //                 }));
    //             });
    //     });
    // }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StatusOrdersPage');
    }

}
