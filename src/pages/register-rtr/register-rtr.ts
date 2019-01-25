import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, App } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Restaurant } from '../../firebase/restaurant';
import { Observable } from 'rxjs';


@IonicPage()
@Component({
    selector: 'page-register-rtr',
    templateUrl: 'register-rtr.html',
})
export class RegisterRtrPage {

    public onYourRestaurantForm: FormGroup;

    restaurant = {} as Restaurant;
    restaurantData: Observable<any>;
    items: Observable<any[]>;

    itemsID: Observable<any>;



    constructor(private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private _fb: FormBuilder,
        public actionsheetCtrl: ActionSheetController,
        public appCtrl: App) {



        this.angularFireAuth.authState.take(1).subscribe(data => {
            // this.items = this.angularFireDatabase.list(`restaurantID/${data.uid}`).valueChanges();
            this.items = this.angularFireDatabase.list(`restaurantID/${data.uid}`).snapshotChanges().map(caches => {
                return caches.map(c => ({
                    key: c.payload.key, ...c.payload.val()
                }));
            });
        });

        this.itemsID = this.angularFireDatabase.list("restaurant/").snapshotChanges().map(caches => {
            return caches.map(c => ({
                key: c.payload.key, ...c.payload.val()
            }));
        });

        //this.items = this.angularFireDatabase.list("/restaurant/").valueChanges();

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RegisterRtrPage');
    }

    ngOnInit() {
        this.onYourRestaurantForm = this._fb.group({
            profiledata: [true, Validators.compose([Validators.required])],
            restaurantTitle: ['', Validators.compose([Validators.required])],
            restaurantAddress: ['', Validators.compose([Validators.required])],
            restaurantType: ['', Validators.compose([Validators.required])],
            restaurantRoad: ['', Validators.compose([Validators.required])],
            restaurantSub: ['', Validators.compose([Validators.required])],
            restaurantDistrict: ['', Validators.compose([Validators.required])],
            restaurantProvince: ['', Validators.compose([Validators.required])],
            restaurantPostal: ['', Validators.compose([Validators.required])]
        });
    }

    addRestaurant(restaurant: Restaurant) {
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: 'crescent',
        });
        loader.present();

        this.angularFireAuth.authState.take(1).subscribe(data => {
            restaurant.id = data.uid;
            this.angularFireDatabase.list(`restaurantID/${data.uid}`).push(restaurant).then(() => {
                this.navCtrl.pop();
            });
        });
        loader.dismiss();
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
                            // this.angularFireDatabase.list(`restaurant/`).remove(item.key);
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

    // this.navCtrl.push('EditRestaurantPage', {rtrID: item.key})

    deleteR(item) {
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`restaurant/`).remove(item.key);
            this.angularFireDatabase.list(`restaurantID/${data.uid}`).remove(item.key);
            // this.angularFireDatabase.list(`restaurant/`).remove(item.key);
        })
    }

    onPop() {
        this.appCtrl.getRootNav().pop({ animate: true, direction: '' });
    }

}
