import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from "ionic-angular";
import { Restaurant } from "../../firebase/restaurant";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs";
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
    selector: "page-dish",
    templateUrl: "dish.html"
})
export class DishPage {

    restaurant = {} as Restaurant;
    dishKey: any;
    images: ImagsHome[] = [
        { image: '../../assets/imgs/restaurants/restaurant10.jpg' },
        { image: '../../assets/imgs/restaurants/restaurant07.jpg' },
        { image: '../../assets/imgs/restaurants/restaurant06.jpg' },
        { image: '../../assets/imgs/restaurants/restaurant05.jpg' },
        { image: '../../assets/imgs/restaurants/restaurant08.jpg' },
    ];
    dishMenu: Observable<any[]>;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireDatabase: AngularFireDatabase,
        private angularFireAuth: AngularFireAuth,
        public loadingCtrl: LoadingController,
        private toastCtrl: ToastController
    ) {

        this.restaurant = this.navParams.get("item");
        this.dishKey = this.navParams.get("dishKey")

        this.dishMenu = this.angularFireDatabase.list(`restaurant/${this.dishKey}/dish`)
            .snapshotChanges()
            .map(caches => {
                return caches.map(c => ({
                    key: c.payload.key,
                    ...c.payload.val()
                }));
            });
    }

    ionViewDidLoad() {
        console.log("ionViewDidLoad DishPage");
    }
    onDish(item) {
        this.navCtrl.push('DishMenuPage', { item: item, itemid: item.id });
    }
    onCart() {
        this.navCtrl.push('BuyPage')
    }
    onSave(restaurant){
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: 'crescent',
        });
        loader.present();
        let toast = this.toastCtrl.create({
            message: 'ได้บันทึกร้านอาหารเรียบร้อย',
            duration: 2000,
            position: 'top'
        });
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`save/${data.uid}`).update(restaurant.key, restaurant).then(() => {
                loader.dismiss();
                toast.present();
            });
        })
    }
}

export interface ImagsHome {
    image: string;
}
