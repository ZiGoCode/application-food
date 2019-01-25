import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Dish } from '../../firebase/dish';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
    selector: 'page-register-dish',
    templateUrl: 'register-dish.html',
})
export class RegisterDishPage {

    items: Observable<any[]>;
    dish = {} as Dish;
    public registerdish: FormGroup;



    constructor(private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private _fb: FormBuilder,
        public appCtrl: App) {

        this.angularFireAuth.authState.take(1).subscribe(data => {
            // this.items = this.angularFireDatabase.list(`restaurantID/${data.uid}`).valueChanges();
            this.items = this.angularFireDatabase.list(`restaurantID/${data.uid}`).snapshotChanges().map(caches => {
                return caches.map(c => ({
                    key: c.payload.key, ...c.payload.val()
                }));
            });
        });

    }

    ngOnInit() {
        this.registerdish = this._fb.group({
            dishid: ['', Validators.compose([
                Validators.required
            ])],
            dishname: ['', Validators.compose([
                Validators.required
            ])],
            dishtype: ['', Validators.compose([
                Validators.required
            ])],
            dishingredients: ['', Validators.compose([
                Validators.required
            ])],
            dishprice: ['', Validators.compose([
                Validators.required
            ])]
        });
    }

    registerDish(dish: Dish, ) {

        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: 'crescent',
        });
        loader.present();
        this.angularFireAuth.authState.take(1).subscribe(data => {
            dish.idrt = data.uid;
            this.angularFireDatabase.list(`restaurantID/${data.uid}/${dish.id}/dish`).push(dish).then(() => {
                this.navCtrl.pop();
            });
        });
        loader.dismiss();
    }

    onPop() {
        this.appCtrl.getRootNav().pop({ animate: true, direction: '' });
        // this.navCtrl.pop();

    }

    ionViewDidLoad() {

    }


}
