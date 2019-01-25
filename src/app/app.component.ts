import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Push, PushObject, PushOptions } from '@ionic-native/push';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    chk_sess: any;
    rootPage: any;
    // rootPage:any = 'LoginPage';

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private screenOrientation: ScreenOrientation,
        private push: Push) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            this.pushSetup();
        });

        this.chk_sess = localStorage.getItem('userData');
        if (this.chk_sess) {
            this.rootPage = 'TabsPage';
        } else {
            this.rootPage = 'LoginPage';
        }
        // this.screenOrientation.lock('portrait');
    }
    pushSetup() {
        const options: PushOptions = {
            android: {
                senderID: '845667622023'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
        }

        const pushObject: PushObject = this.push.init(options);


        pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

        pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

    }
}

