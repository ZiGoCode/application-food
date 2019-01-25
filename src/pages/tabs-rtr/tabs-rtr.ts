import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
    selector: 'page-tabs-rtr',
    templateUrl: 'tabs-rtr.html',
})
export class TabsRtrPage {
    @ViewChild('myTabs') tabRef;
    tab1 = 'NewPage';
    tab2 = 'OpenPage';
    tab3 = 'OrdersPage';
    tab4 = 'MessagesRtrPage';
    tab5 = 'StarsPage';
    idteb: any;
    qty: any;
    getDa: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public appCtrl: App,
        private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
    ) {
        this.qty = '';
        this.getNotData();
        this.idteb = this.navParams.get('idteb');

    }
    ionViewWillEnter() {
        if (this.idteb) {
            this.tabRef.select(this.idteb);
            this.idteb = this.navParams.get('');
        }


    }

    getNotData() {
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.angularFireDatabase.list(`buymenuid/${data.uid}/menu`).valueChanges()
                .subscribe(res => {
                    this.qty = res.length;
                    console.log('qty+', this.qty)
                    for (let i = 0; i < res.length; i++) {
                        this.getDa = res[i];
                        const data = this.getDa.status;
                        const data1 = "สำเร็จ";
                        console.log('Status', data, data1);
                        if (data == data1) {
                            this.qty = Number(this.qty - 1);
                        }
                    }
                    if(this.qty == 0){
                        this.qty = '';
                    }
                    console.log('qty--', this.qty)
                });
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TabsRtrPage');
    }
    rootpage() {
        this.appCtrl.getRootNav().pop({ animate: true, direction: 'forward' });
    }

}
