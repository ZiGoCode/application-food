import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(private angularFireDatabase: AngularFireDatabase, private angularFireStorage: AngularFireStorage) {

  }
  getFiles() {
    let ref = this.angularFireDatabase.list('files');
    return ref.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    })
  }
  uploadToStorage(information): AngularFireUploadTask {
    let newName = `${new Date().getTime()}.txt`
    return this.angularFireStorage.ref(`files/${newName}`).putString(information);
  }
  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      // url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    }
    return this.angularFireDatabase.list('files').push(toSave);
  }
  deleteFile(file) {
    let key = file.key
    let storagePath = file.fullPath;

    this.angularFireDatabase.list('files').remove(key);
    return this.angularFireStorage.ref(storagePath).delete()
  }


}
