import { Injectable } from '@angular/core';
import { Entry } from '../../model/entry';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';

import { firebaseConfig } from './config_firebase';

const PLACEHOLDER_IMAGE: string = "/assets/imgs/placeholder.png";

@Injectable()
export class EntryDataServiceProvider {
  private db: any;
  private entries: Entry[] = [];

  private serviceObserver: Observer<Entry[]>;
  private clientObservable: Observable<Entry[]>;

  constructor() {
    // initiate firebase
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.database();

    // create observer an observable
    this.clientObservable = Observable.create(observerThatWasCreated => {
      this.serviceObserver = observerThatWasCreated;
    })

    // retrieve data from firebase
    let listRef = this.db.ref('/entryItems');
    listRef.on('value', snapshot => {
      this.entries = [];
      snapshot.forEach(childSnapshot => {
        // copy a new entry
        let entry: Entry = {
          key: childSnapshot.key,
          title: childSnapshot.val().title,
          text: childSnapshot.val().text,
          timeStamp: new Date(childSnapshot.val().timeStamp),
          image: childSnapshot.val().image
        };
        this.entries.push(entry);
      });

      // notify subscribers in home page to sync the update
      this.notifySubscribers();
    });
  }

  public getEntries(): Entry[] {
    let entriesClone = JSON.parse(JSON.stringify(this.entries)); // clone another entries to entriesClone
    // console.log("in function getEntries");
    // console.log(this.entries);
    // console.log(entriesClone);
    return entriesClone;
  }

  // return a promise
  public getEntryByKey(key: string) {
    let parentRef = this.db.ref('/entryItems');
    let childRef = parentRef.child(key);
    return childRef.once('value');
  }

  public addEntry(entry: Entry) {
    if (entry != undefined) {
      let listRef = this.db.ref('/entryItems');
      let itemRef = listRef.push();
      let itemRecord = {
        title: entry.title,
        text: entry.text,
        timeStamp: entry.timeStamp.toISOString(),
        image: entry.image
        // need to convert to string before store into firebase 
      }
      // console.log(itemRecord);
      itemRef.set(itemRecord);
    }
  }

  public updateEntry(key: string, newEntry: Entry):void {
    let parentRef = this.db.ref('/entryItems');
    let childRef = parentRef.child(key);
    let cloneEntry = {
      title: newEntry.title,
      text: newEntry.text,
      timeStamp: newEntry.timeStamp.toISOString(),
      image: newEntry.image
    }
    childRef.set(cloneEntry);
  }

  public removeEntry(key: string): void {
    let parentRef = this.db.ref('/entryItems');
    let childRef = parentRef.child(key);
    childRef.remove();
    return;
  }

  public saveData(entries: Entry[]) {
    // save Entry[] into firebase
    // no need to save key into firebase,
    // use auto generated key
    let listRef = this.db.ref('/entryItems');
    for (let entry of entries) {
      let itemRef = listRef.push();
      let tempItem = {
        title: entry.title,
        text: entry.text,
        timeStamp: entry.timeStamp,
        image: PLACEHOLDER_IMAGE
      }
      itemRef.set(tempItem);
    }
    console.log("saved", entries);
  }

  public getObservable(): Observable<Entry[]> {
    return this.clientObservable;
  }

  private notifySubscribers(): void {
    this.serviceObserver.next(undefined);
  }

}
