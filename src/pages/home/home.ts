import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Entry } from '../../model/entry';
import { EntryDetailPage } from '../entry-detail/entry-detail';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private entries: Entry[];
  constructor(public navCtrl: NavController, private entryService: EntryDataServiceProvider) {
    this.entryService.getObservable().subscribe(update => {
      this.entries = entryService.getEntries();
    })
    this.entries = entryService.getEntries();
  }

  private addEntry() {
    this.navCtrl.push(EntryDetailPage);
  }
  
  private editEntry(entryKey: string) {
    this.navCtrl.push(EntryDetailPage, {"entryKey": entryKey});
  }

  private deleteEntry(entryKey: string) {
    this.entryService.removeEntry(entryKey);
  }
}
