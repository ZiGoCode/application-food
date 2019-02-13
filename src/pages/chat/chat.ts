import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Restaurant } from '../../firebase/restaurant';
import { Observable } from 'rxjs';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {
    chatText = {} as Text;
    chatMe: any;
    ChatR: any;
    restaurant = {} as Restaurant;
    getData: Observable<any[]>;
    keyID: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private angularFireDatabase: AngularFireDatabase,
        private angularFireAuth: AngularFireAuth,
        public alertCtrl: AlertController,
    ) {
        this.restaurant = this.navParams.get("item");
        this.keyID = this.navParams.get("id");

        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.getData = this.angularFireDatabase.list(`chats/${data.uid}/${this.keyID}/text`)
                .snapshotChanges()
                .map(caches => {
                    return caches.map(c => ({
                        key: c.payload.key,
                        ...c.payload.val()
                    }));
                });
        });
        this.chatMe = [];
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChatPage');
    }

    sendChat(text: Text, restaurant) {
        try {
            if (text.text == '') {
                return;
            } else {
                this.angularFireAuth.authState.take(1).subscribe(data => {
                    text.id = data.uid;
                    text.time = new Date();
                    text.messageId = new Date().toLocaleString();
                    this.chatMe.push(text);
                    console.log('===', text);
                    this.angularFireDatabase.list(`chats/${data.uid}/${restaurant.key}/text`).push(text);
                    this.chatText.text = '';
                });
            }
        } catch (error) {
            let alert = this.alertCtrl.create({
                title: 'ลงชื่อออก',
                message: error,
                buttons: [
                    {
                        text: 'ตกลง',
                        role: 'cancel',
                        handler: () => {
                        }
                    },
                ]
            })
            alert.present()
        }
    }

}
export interface Text {
    id: string;
    text: string;
    time: any;
    messageId: any;
}