import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Restaurant } from '../../firebase/restaurant';

@IonicPage()
@Component({
    selector: 'page-restaurant',
    templateUrl: 'restaurant.html',
})
export class RestaurantPage {

    items: Observable<any[]>;
    itemsText: Restaurant[];
    dataText: any;
    testData: any;

    imageLove: ImagsHome[] = [
        {
            image: "../../assets/imgs//restaurants/restaurant03sq.jpg",
            name: 'Ipsum Restaurant'
        },
        {
            image: "../../assets/imgs//restaurants/restaurant05sq.jpg",
            name: 'Blue Print Restaurant & Bar'
        },
        {
            image: "../../assets/imgs//restaurants/restaurant06sq.jpg",
            name: "George's Hamburguer"
        },
        {
            image: "../../assets/imgs//restaurants/restaurant07sq.jpg",
            name: 'La Vitta'
        },

    ];

    constructor(private angularFireDatabase: AngularFireDatabase,
        public navCtrl: NavController, public navParams: NavParams, private appCtrl: App) {

        // this.angularFireDatabase.list(`restaurant`)
        //     .snapshotChanges()
        //     .map(caches => {
        //         return caches.map(c => ({
        //             key: c.payload.key,
        //             ...c.payload.val()
        //         }));
        //     }).subscribe(data => {
        //         this.dataText = data;
        //         console.log(this.dataText)

        //     });

        this.testData = [];
        this.initializeItems();



    }

    initializeItems() {
        this.angularFireDatabase.list(`restaurant`)
            .snapshotChanges()
            .map(caches => {
                return caches.map(c => ({
                    key: c.payload.key,
                    ...c.payload.val()
                }));
            }).subscribe(data => {
                console.log('===', this.dataText);
                return this.dataText = data;
            });
    }

    getItems(ev) {
        // Reset items back to all of the items
        this.initializeItems();

        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            // this.dataText = this.dataText.filter((dataText) => {
            //     return (dataText.toLowerCase().indexOf(val.toLowerCase()) > -1);
            // })

            this.testData = this.dataText.filter((dataText) => {
                return ((dataText.title.toLowerCase().indexOf(val.toLowerCase()) > -1));
                // ||
                // (dataText.district.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                // (dataText.province.toLowerCase().indexOf(val.toLowerCase()) > -1));
            })
        } else {
            return this.testData = [];
        }
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
export interface ImagsHome {
    image: string;
    name: string;
}