import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { Baht } from '../../firebase/baht';
import { Status } from '../../firebase/status';
import { Buy } from '../../firebase/buy';

@IonicPage()
@Component({
    selector: 'page-buy',
    templateUrl: 'buy.html',
})
export class BuyPage {
    @ViewChild(Content) content: Content;
    
    itemsBuy: Observable<any[]>;
    baht = 0;
    buyBaht: any;
    numbers = new Array();
    element = 0;
    keyTeble: any;
    heroes = ['AB01', 'AB02', 'AB03', 'AB04', 'AB05', 'AB06', 'AB07', 'AB08', 'AB09', 'AB10'];
    dis: any;
    dishBaht: any;
    numberdis: number;
    bass: number;
    keyidJ: any;
    keyid = new Array();
    dishdeteil = new Array();
    oderid: number;
    cout: any;
    cout1: any;
    noteDish = {} as Baht;
    dishMenu: Buy[] = [];
    noteng: string;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController) {

        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.itemsBuy = this.angularFireDatabase.list(`buymenu/${data.uid}`)
                .snapshotChanges()
                .map(caches => {
                    return caches.map(c => ({
                        key: c.payload.key, ...c.payload.val()
                    }));
                });
        });
        this.getBaht();
        this.noteDish.note = '';

        console.log('---', this.dishMenu);
    }
    getBaht() {
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`buymenu/${data.uid}`).valueChanges()
                .subscribe(res => {
                    this.bass = res.length;
                    for (let i = 0; i < res.length; i++) {
                        this.dis = (res[i]);
                        this.dishMenu.push(this.dis);
                        this.dishdeteil[i] = (res[i]);
                        this.dishBaht = JSON.stringify(this.dis.price);
                        this.numberdis = Number(this.dishBaht);
                        this.keyidJ = this.dis.keyID;
                        console.log(this.keyidJ);
                        this.numbers.push(this.numberdis)
                    }
                    for (let i = 0; i < this.numbers.length; i++) {
                        this.element += this.numbers[i];
                    }
                });
        });
    }
    getOder() {
        this.angularFireDatabase.list(`buymenuid/${this.keyidJ}/menu/`).valueChanges()
            .subscribe(res => {
                console.log('length', res.length);
                if (res.length == 0) {
                    return
                } else {
                    this.cout = res.length;
                }
            });
    }

    ranbom(min_val, max_val) {
        return Math.floor(Math.random() * Math.floor(max_val - min_val + 1)) + min_val;
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
                                .list(`buymenu/${data.uid}`)
                                .remove(item.key);
                            this.numbers.length = 0;
                            this.dishMenu.length = 0
                            this.element = 0;
                        });
                        loader.dismiss();
                    }
                }
            ]
        });
        alert.present();
    }

    showRadio() {
        let alert = this.alertCtrl.create();
        alert.setTitle('รหัสโต๊ะ');

        for (let i = 0; i < this.heroes.length; i++) {
            alert.addInput(
                {
                    type: 'radio',
                    label: this.heroes[i],
                    value: this.heroes[i],
                    checked: false,
                }
            );
        }

        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => {
                // console.log('Checkbox data:', data);
                this.keyTeble = false;
                this.keyTeble = data;
            }
        });
        alert.present();
    }

    clickHome(){
        this.navCtrl.setRoot('TabsPage');
    }

    onBuy(noteDish : Baht) {
        if (this.bass == 0) {
            const alert = this.alertCtrl.create({
                title: 'แจ้งเตือน!',
                subTitle: 'กรุณาเลือกเมนูอาหารก่อน',
                buttons: ['OK']
            });
            alert.present();
        }
        else if (!this.keyTeble) {
            const alert = this.alertCtrl.create({
                title: 'แจ้งเตือน!',
                subTitle: 'กรุณาเลือกโต๊ะอาหาร',
                buttons: ['OK']
            });
            alert.present();
        } else {

            let alert = this.alertCtrl.create();
            alert.setTitle('Pay with');

            alert.addInput({
                type: 'radio',
                label: 'จ่ายด้วยเงินสด',
                value: 'blue1',
                checked: true
            });
            alert.addInput({
                type: 'radio',
                label: 'จ่ายด้วยบัตรเครดิต',
                value: 'blue2',
                checked: false
            });
            alert.addButton({
                text: 'OK',
                handler: data => {
                    const loader = this.loadingCtrl.create({
                        content: "Please wait...",
                        spinner: 'crescent',
                    });
                    loader.present();

                    if (data == 'blue1') {
                        const loader = this.loadingCtrl.create({
                            content: "Please wait...",
                            spinner: 'crescent',
                        });
                        loader.present();

                        const status = {} as Baht;
                        const statu = {} as Status;
                        // status.oder = 1;
                        // status.oder = this.cout;
                        status.keyteble = this.keyTeble;
                        status.note = noteDish.note;
                        status.baht = this.element;
                        status.status = 'รอดำเนินการ';
                        status.number = this.ranbom(1000000, 9999999);
                        status.date = new Date().toLocaleString();
                        status.ioconcolor = 'danger5';
                        statu.date = new Date().toLocaleString();
                        statu.status = 'รอดำเนินการ';
                        statu.color = 'danger5';
                        statu.line = '#ffffff'
                        // this.navCtrl.push('MyOrdersPage', {item: 1});

                        this.angularFireAuth.authState.take(1).subscribe(data => {
                            status.keyuser = data.uid;
                            this.angularFireDatabase.list(`myoder/${data.uid}/menu`).push(status).then(id => {
                                this.angularFireDatabase.object(`myoder/${data.uid}/menu/${id.key}/dish`).set(this.dishMenu);
                                this.angularFireDatabase.list(`myoder/${data.uid}/menu/${id.key}/statu`).push(statu);
                                status.idoder = id.key;
                                this.angularFireDatabase.list(`buymenuid/${this.keyidJ}/menu`).push(status).then(datar => {
                                    this.angularFireDatabase.object(`buymenuid/${this.keyidJ}/menu/${datar.key}/dish`).set(this.dishMenu);
                                });
                                console.log(status.idoder);
                            });
                            // this.angularFireDatabase.list(`buymenuid/${this.keyidJ}/menu`).push(status).then(datar => {
                            //     this.angularFireDatabase.list(`buymenuid/${this.keyidJ}/menu/${datar.key}/dish`).push(this.dis);
                            // }); 
                        });

                        this.navCtrl.push('MyOrdersPage', { item: 1 });
                        loader.dismiss();
                    }
                    if (data == 'blue2') {

                        this.navCtrl.push('CheckoutPage');
                    }
                    loader.dismiss();
                }
            });
            alert.present();
        }
    }
}
