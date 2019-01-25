import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Dish } from '../../firebase/dish';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Buy } from '../../firebase/buy';


@IonicPage()
@Component({
    selector: 'page-dish-menu',
    templateUrl: 'dish-menu.html',
})
export class DishMenuPage {

    buy = 1;
    cout: any;
    dishMenu = {} as Dish;
    baht: number;
    items: Observable<any[]>;
    dishMenuID: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private toastCtrl: ToastController,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        public loadingCtrl: LoadingController) {

        this.dishMenu = this.navParams.get("item");
        this.dishMenuID = this.navParams.get("itemid");
        console.log(this.dishMenuID);
        this.cout = this.dishMenu.price;
        this.baht = this.dishMenu.price;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DishMenuPage');
    }

    presentMenu(dishMenu: Dish) {
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: 'crescent',
        });
        loader.present();
        let toast = this.toastCtrl.create({
            message: 'เพิ่มไปยังตะกร้าเมนูเรียบร้อยเเล้ว',
            duration: 3000,
            position: 'top'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        this.angularFireAuth.authState.take(1).subscribe(data => {
            const menu = {} as Buy;
            menu.id = this.dishMenu.id;
            menu.keyID = this.dishMenu.idrt;
            menu.title = this.dishMenu.title;
            menu.ingredients = this.dishMenu.ingredients;
            menu.type = this.dishMenu.type;
            menu.price = Number(this.cout);
            menu.number = Number(this.buy);
            console.log('ข้อมูล', menu.id);
            this.angularFireDatabase.list(`buymenu/${data.uid}`).push(menu).then(() => {
                // this.angularFireDatabase.list(`buymenuid/${this.dishMenu.idrt}/menu`).push(menu)
                loader.dismiss();
                toast.present();
            });
        });
    }

    onAdd() {
        this.buy++
        this.cout = this.buy * this.baht;
    }
    onRemove() {
        if (this.buy > 1) {
            this.buy--
            this.cout -= this.baht;
        }
    }

    onBuy(dishMenu: Dish) {
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: 'crescent',
        });
        loader.present();
        let toast = this.toastCtrl.create({
            message: 'เพิ่มไปยังตะกร้าเมนูเรียบร้อยเเล้ว',
            duration: 3000,
            position: 'top'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
        // console.log(dishMenu);
        this.angularFireAuth.authState.take(1).subscribe(data => {
            const menu = {} as Buy;
            menu.id = this.dishMenu.id;
            menu.keyID = this.dishMenu.idrt;
            menu.title = this.dishMenu.title;
            menu.ingredients = this.dishMenu.ingredients;
            menu.type = this.dishMenu.type;
            menu.price = Number(this.cout);
            menu.number = Number(this.buy);
            // console.log(this.buy);

            this.angularFireDatabase.list(`buymenu/${data.uid}`).push(menu).then(() => {
                // this.angularFireDatabase.list(`buymenuid/${this.dishMenu.idrt}/menu`).push(menu);
                loader.dismiss();
                this.navCtrl.push('BuyPage', { baht: menu.price });
                toast.present();
            });
            // const baht = {} as Baht;
            // baht.baht = this.dishMenu.price;
            // this.angularFireDatabase.list(`baht/${data.uid}`).push(baht);
        });
    }
    onCart() {
        this.navCtrl.push('BuyPage');
    }
}
