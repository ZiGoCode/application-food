import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html',
})
export class TabsPage {
    @ViewChild('myTabs') tabRef;
    private selectedTab: number;
    tab1 = 'HomePage';
    tab2 = 'RestaurantPage';
    tab3 = 'FeedPage';
    tab4 = 'SavedPage';
    tab5 = 'MyProfilePage';
    qty: any;
  

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public events: Events,
        public ngZone: NgZone,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase) {

        this.selectedTab = this.navParams.get('selectedTab') || 0;

        this.qty = '';
        
        // events.subscribe('reloadTab', () => {
        //     ngZone.run(() => {
        //         this.loadQtyNew();
        //     });
        // });
        this.getBaht();
    }
    ionViewWillEnter() {
        if (this.selectedTab) {
            this.tabRef.select(this.selectedTab);
        }
    }

    // loadQtyNew() {
    //     this.qty = 0
    //     let get_qty = JSON.parse(sessionStorage.getItem('cart'))
    //     get_qty.forEach(val => {
    //         this.qty += Number(val.qty)
    //     });
    //     if (get_qty.length == 0) this.qty = 0
    //     if (this.qty == 0) this.qty = ''

    // }

    getBaht() {
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`buymenu/${data.uid}`).valueChanges()
                .subscribe(res => {
                    this.qty = res.length;
                    if (this.qty == 0) this.qty = '';
                })

        });


    }
   

    ionViewDidLoad() {
        console.log('ionViewDidLoad TabsPage');
    }

}
