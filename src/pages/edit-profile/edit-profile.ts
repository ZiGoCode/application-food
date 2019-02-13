import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  files: Observable<any[]>
  image: any
  uid: any;
  isenabled: boolean = false;
  profileData: Observable<any>;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dataProviders: DataProvider, 
    public alertCtrl: AlertController,
    private toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private angularFireDatabase: AngularFireDatabase, 
    private angularFireStorage: AngularFireStorage, 
    private angularFireAuth: AngularFireAuth, ) {

    this.angularFireAuth.authState.subscribe(data => {
      this.profileData = this.angularFireDatabase.object(`user/${data.uid}`).valueChanges();
    });


  }

  addFile() {
    let inputAlert = this.alertCtrl.create({
      title: 'Store new information',
      inputs: [
        {
          name: 'info',
          placeholder: 'Lorem ipsum dolor...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Store',
          handler: data => {
            this.uploadInformation(data.info);
          }
        }
      ]
    });
    inputAlert.present();
  }

  uploadInformation(text) {

    let upload = this.dataProviders.uploadToStorage(text);
    upload.then().then(res => {
      this.dataProviders.storeInfoToDatabase(res.metadata).then(() => {
        // console.log('==',res.metadata.g)
        let toast = this.toastCtrl.create({
          message: 'New File added!',
          duration: 3000
        });
        toast.present();
      });
    });
  }

  deleteFile(file) {
    this.dataProviders.deleteFile(file).subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'File removed!',
        duration: 3000
      });
      toast.present();
    });
  }

  async uploadFile(event) {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: 'crescent',
    });
    loader.present();
    const idurl = await this.angularFireAuth.authState.take(1).subscribe(data => {
      this.uid = data.uid;
      const file = event.target.files[0];
      const filePath = `image/${data.uid}/profile`;
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
    this.printurl(idurl);
    loader.dismiss();
  }

  async printurl(url) {
    if (url) {
      this.isenabled = true
    }

  }
  prin(URL) {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: 'crescent',
    });
    loader.present();
    URL.subscribe(data => {
      const ad = data
      this.image = String(data)
      console.log('===', ad)
    });
    try {
      this.angularFireAuth.authState.take(1).subscribe(data => {
        this.angularFireDatabase.object(`user/${data.uid}/img`).set(this.image)
      })
    } catch (error) {
      loader.dismiss();
      console.log(error);
    }
    loader.dismiss();
  }
}
