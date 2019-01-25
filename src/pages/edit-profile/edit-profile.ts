import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
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
  image:any

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProviders: DataProvider, public alertCtrl: AlertController,
    private toastCtrl: ToastController, private angularFireDatabase: AngularFireDatabase, private angularFireStorage: AngularFireStorage) {

    this.files = this.dataProviders.getFiles();

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

  viewFile(url) {

  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'name-your-file-path-here';
    const fileRef = this.angularFireStorage.ref(filePath);
    const task = this.angularFireStorage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    ).subscribe();
    // this.downloadURL.subscribe(data => {
    //   const ad = data
    //   console.log('===', ad)
    // });
    // console.log(this.downloadURL);
  }
  prin(URL) {
    URL.subscribe(data => {
      const ad = data
      this.image = String(data)
      console.log('===', ad)
    })
  }



}
