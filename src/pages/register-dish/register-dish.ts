import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Dish } from '../../firebase/dish';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@IonicPage()
@Component({
    selector: 'page-register-dish',
    templateUrl: 'register-dish.html',
})
export class RegisterDishPage {

    items: Observable<any[]>;
    dish = {} as Dish;
    public registerdish: FormGroup;
    uid: any;
    uploadPercent: Observable<number>;
    downloadURL: Observable<string>;
    image: any;


    constructor(private angularFireAuth: AngularFireAuth,
        private angularFireDatabase: AngularFireDatabase,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private _fb: FormBuilder,
        public appCtrl: App,
        private angularFireStorage: AngularFireStorage) {

        this.angularFireAuth.authState.take(1).subscribe(data => {
            // this.items = this.angularFireDatabase.list(`restaurantID/${data.uid}`).valueChanges();
            this.items = this.angularFireDatabase.list(`restaurantID/${data.uid}`).snapshotChanges().map(caches => {
                return caches.map(c => ({
                    key: c.payload.key, ...c.payload.val()
                }));
            });
        });

    }

    ngOnInit() {
        this.registerdish = this._fb.group({
            dishid: ['', Validators.compose([
                Validators.required
            ])],
            dishname: ['', Validators.compose([
                Validators.required
            ])],
            dishtype: ['', Validators.compose([
                Validators.required
            ])],
            dishingredients: ['', Validators.compose([
                Validators.required
            ])],
            dishprice: ['', Validators.compose([
                Validators.required
            ])]
        });
    }

    registerDish(dish: Dish, URL) {

        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: 'crescent',
        });
        loader.present();

        URL.subscribe(data => {
            const ad = data
            this.image = String(data)
            console.log('===', ad)
            dish.img = this.image;
        });

        this.angularFireAuth.authState.take(1).subscribe(data => {
            dish.idrt = data.uid;
            this.angularFireDatabase.list(`restaurantID/${data.uid}/${dish.id}/dish`).push(dish).then(() => {
                this.navCtrl.pop();
            });
        });
        loader.dismiss();
    }

    onPop() {
        this.appCtrl.getRootNav().pop({ animate: true, direction: '' });
        // this.navCtrl.pop();
    }

    uploadFile(event) {
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: 'crescent',
        });
        loader.present();

        // var reader = new FileReader();
        // this.imagePath = event;
        // reader.readAsDataURL(event[0]);
        // reader.onload = (_event) => {
        //     this.imgURL = reader.result;
        // }
        this.angularFireAuth.authState.take(1).subscribe(data => {
            this.uid = data.uid;
            const file = event.target.files[0];
            const date = new Date().toLocaleString();
            const filePath = `imagedish/${data.uid}/profile/${date}`;
            const fileRef = this.angularFireStorage.ref(filePath);
            const task = this.angularFireStorage.upload(filePath, file);
            this.uploadPercent = task.percentageChanges();

            task.snapshotChanges().pipe(
                finalize(() => {
                    return this.downloadURL = fileRef.getDownloadURL()
                }
                )
            ).subscribe();

        });
        loader.dismiss();
    }
}
