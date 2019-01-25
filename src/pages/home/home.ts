import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App } from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs";

@IonicPage()
@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class HomePage {
    images: ImagsHome[] = [
        {
            image: "../../assets/imgs/restaurants/restaurant10.jpg",
            name: ''
        },
        {
            image: "../../assets/imgs/restaurants/restaurant07.jpg",
            name: ''
        },
        {
            image: "../../assets/imgs/restaurants/restaurant06.jpg",
            name: ''
        },
        {
            image: "../../assets/imgs/restaurants/restaurant05.jpg",
            name: ''
        },
        {
            image: "../../assets/imgs/restaurants/restaurant08.jpg",
            name: ''
        }
    ];
    imageLink: ImagsHome[] = [
        {
            image: "../../assets/imgs//restaurants/restaurant08sq.jpg",
            name: "Barracuda's Seafood"
        },
        {
            image: "../../assets/imgs//restaurants/restaurant10sq.jpg",
            name: 'Bukhara Restaurant'
        },
        {
            image: "../../assets/imgs//restaurants/restaurant09sq.jpg",
            name: "Melvyn's"
        },
        {
            image: "../../assets/imgs//restaurants/restaurant11sq.jpg",
            name: "CraftWoks Restaurant & Bar"
        },
        {
            image: "../../assets/imgs//restaurants/restaurant03sq.jpg",
            name: 'Bukhara Restaurant'
        },
        {
            image: "../../assets/imgs//restaurants/restaurant05sq.jpg",
            name: 'Bukhara Restaurant'
        },
        {
            image: "../../assets/imgs//restaurants/restaurant06sq.jpg",
            name: 'Bukhara Restaurant'
        },
        {
            image: "../../assets/imgs//restaurants/restaurant07sq.jpg",
            name: 'Bukhara Restaurant'
        },

    ];
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

    imagesi: ImagsHomeSi[] = [
        { image: "../../assets/imgs/restaurants/restaurant07sq.jpg" },
        { image: "../../assets/imgs/restaurants/restaurant08sq.jpg" },
        { image: "../../assets/imgs/restaurants/restaurant05sq.jpg" },
        { image: "../../assets/imgs/restaurants/restaurant06sq.jpg" },
        { image: "../../assets/imgs/restaurants/restaurant04sq.jpg" },
        { image: "../../assets/imgs/restaurants/restaurant10sq.jpg" },
        { image: "../../assets/imgs/restaurants/restaurant09sq.jpg" },
        { image: "../../assets/imgs/restaurants/restaurant12sq.jpg" }
    ];

    items: Observable<any[]>;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireDatabase: AngularFireDatabase,
        public appCtrl: App
    ) {

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
        console.log("ionViewDidLoad HomePage");
        console.log(this.items);

    }

    dishPage(item) {
        this.appCtrl
            .getRootNav()
            .push("DishPage", { item: item, dishKey: item.key }, { animate: true, direction: "forward" });
    }
}

export interface ImagsHome {
    image: string;
    name: string;
}
export interface ImagsHomeSi {
    image: string;
}
