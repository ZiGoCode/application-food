import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    AlertController,
    App
} from "ionic-angular";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Restaurant } from "../../firebase/restaurant";
import { Observable } from "rxjs";

@IonicPage()
@Component({
    selector: "page-edit-restaurant",
    templateUrl: "edit-restaurant.html"
})
export class EditRestaurantPage {
    public onYourRestaurantForm: FormGroup;
    restaurant = {} as Restaurant;
    items: Observable<any[]>;

    constructor(
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        public navCtrl: NavController,
        public navParams: NavParams,
        private _fb: FormBuilder,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public appCtrl: App,
    ) {

        this.restaurant = this.navParams.get("item");

        this.angularFireAuth.authState.take(1).subscribe(data => {
            // this.items = this.angularFireDatabase.list(`restaurantID/${data.uid}`).valueChanges();
            this.items = this.angularFireDatabase
                .list(`restaurantID/${data.uid}`)
                .snapshotChanges()
                .map(caches => {
                    return caches.map(c => ({
                        key: c.payload.key,
                        ...c.payload.val()
                    }));
                });
        });
    }

    ionViewDidLoad() {
        console.log("ionViewDidLoad EditRestaurantPage");
    }

    nvapop() {
        this.navCtrl.pop().then(() => {
            const idteb = 0;
        });
    }
    ngOnInit() {
        this.onYourRestaurantForm = this._fb.group({
            profiledata: [true, Validators.compose([Validators.required])],
            restaurantTitle: ["", Validators.compose([Validators.required])],
            restaurantAddress: ["", Validators.compose([Validators.required])],
            restaurantType: ["", Validators.compose([Validators.required])],
            restaurantRoad: ["", Validators.compose([Validators.required])],
            restaurantSub: ["", Validators.compose([Validators.required])],
            restaurantDistrict: ["", Validators.compose([Validators.required])],
            restaurantProvince: ["", Validators.compose([Validators.required])],
            restaurantPostal: ["", Validators.compose([Validators.required])]
        });
    }

    editRestaurant(restaurant) {
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: "crescent"
        });
        loader.present();
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase
                .list(`restaurant/`)
                .update(restaurant.key, restaurant);
            this.angularFireDatabase
                .list(`restaurantID/${data.uid}`)
                .update(restaurant.key, restaurant)
                .then(() => {
                    this.navCtrl.pop();
                });
        });
        loader.dismiss();
    }

    // delete(item) {
    //   this.angularFireAuth.authState.take(1).subscribe(data => {
    //     this.angularFireDatabase.list(`restaurant/`).remove(item.key);
    //     this.angularFireDatabase
    //       .list(`restaurantID/${data.uid}`)
    //       .remove(item.key);
    //   });
    // }
    delete(item) {
        let alert = this.alertCtrl.create({
            title: "Delete",
            message: "คุณแน่ใจหรือไม่ที่ต้องการลบข้อมูลนี้",
            buttons: [
                {
                    text: "ยกเลิก",
                    role: "cancel",
                    handler: () => { }
                },
                {
                    text: "ตกลง",
                    handler: () => {
                        this.angularFireAuth.authState.take(1).subscribe(data => {
                            this.angularFireDatabase.list(`restaurant/`).remove(item.key);
                            this.angularFireDatabase
                                .list(`restaurantID/${data.uid}`)
                                .remove(item.key);
                        });
                        this.navCtrl.pop();
                    }
                }
            ]
        });
        alert.present();
    }
}
