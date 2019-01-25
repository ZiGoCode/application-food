import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
    selector: 'page-restaurant',
    templateUrl: 'restaurant.html',
})
export class RestaurantPage {

    items: Observable<any[]>;

    constructor(private angularFireDatabase: AngularFireDatabase,
        public navCtrl: NavController, public navParams: NavParams, private appCtrl: App) {

        this.items = this.angularFireDatabase.list(`restaurant`)
            .snapshotChanges()
            .map(caches => {
                return caches.map(c => ({
                    key: c.payload.key,
                    ...c.payload.val()
                }));
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RestaurantPage');
    }

    dishPage(item) {
        this.appCtrl
            .getRootNav()
            .push("DishPage", { item: item, dishKey: item.key }, { animate: true, direction: "forward" });
    }
    onBuy() {
        this.appCtrl
            .getRootNav()
            .push("BuyPage", {}, { animate: true, direction: "forward" });
    }


}
