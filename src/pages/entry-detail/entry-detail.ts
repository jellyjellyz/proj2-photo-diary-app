import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { Entry } from '../../model/entry';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';
import { AlertController } from 'ionic-angular';



const PLACEHOLDER_IMAGE: string = "/assets/imgs/placeholder.png";
const SPINNER_IMAGE: string = "/assets/imgs/spinner.gif";



/**
 * Generated class for the EntryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entry-detail',
  templateUrl: 'entry-detail.html',
})
export class EntryDetailPage {


  private entry: Entry;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private entryDataService: EntryDataServiceProvider,
    private alertCtrl: AlertController, private camera: Camera) {
    let entryKey = this.navParams.get("entryKey");
    if (entryKey === undefined) {
      this.entry = new Entry();
      this.entry.title = "";
      this.entry.text = "";
      this.entry.key = ""; // placeholder, will get a value after saved to firebase
      this.entry.image = PLACEHOLDER_IMAGE;
    } else {
      this.entryDataService.getEntryByKey(entryKey).then(snapshot => {
        this.entry = {
          key: snapshot.key,
          title: snapshot.val().title,
          text: snapshot.val().text,
          timeStamp: new Date(snapshot.val().timeStamp),
          image: snapshot.val().image
        };
      });
    }
  }

  public callback(param: Entry) {
    this.entry = param;
  }

  private saveEntry() {
    if (this.entry.title === "") {
      this.promptEmtryAlert();
    } else {
      if (this.entry.key === "") {
        this.entry.timeStamp = new Date();
        this.entryDataService.addEntry(this.entry);
        this.navCtrl.pop();
      } else {
        this.updateTimeStampAlert();
      }
    }
  }

  private promptEmtryAlert() {
    let alert = this.alertCtrl.create({
      title: 'Please write something',
      subTitle: 'title cannot left blank',
      buttons: ['Got It!']
    });
    alert.present();
  }

  private updateTimeStampAlert() {
    let alert = this.alertCtrl.create({
      title: 'Update timestamp?',
      message: `Do you want to keep the original timestamp for this entry,
                or update to the current time?`,
    });

    alert.addInput({
      type: 'radio',
      label: `Keep (${new Date(this.entry.timeStamp).toLocaleString()})`,
      value: `${this.entry.timeStamp}`,
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: `Update (${new Date().toLocaleString()})`,
      value: `${new Date()}`,
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        alert.dismiss().then(() => {
          this.entry.timeStamp = new Date(data);
          this.entryDataService.updateEntry(this.entry.key, this.entry);
        })
        alert.onDidDismiss(() => {
          this.navCtrl.pop();
        });
        return false;
      }
    });
    alert.present();
  }

  private goback() {
    this.navCtrl.pop();
  }


  private takePic() {
    let originImage = this.entry.image;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // console.log(imageData)
      if (imageData) {
        this.entry.image = 'data:image/jpeg;base64,' + imageData;
      } else {
        this.entry.image = originImage;
      }
    }, (err) => {
      this.entry.image = originImage;
    });
    this.entry.image = SPINNER_IMAGE;
  }
}
