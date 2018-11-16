import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Entry } from '../../model/entry';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';
import { AlertController } from 'ionic-angular';

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
    private alertCtrl: AlertController) {
    let entryKey = this.navParams.get("entryKey");
    if (entryKey === undefined) {
      this.entry = new Entry();
      this.entry.title = "";
      this.entry.text = "";
      this.entry.key = ""; // placeholder, will get a value after saved to firebase
    } else {
      this.entry = this.entryDataService.getEntryByKey(entryKey);
    }
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
        alert.onDidDismiss( () => {
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

}