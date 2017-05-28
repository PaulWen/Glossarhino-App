import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Entry } from "../../providers/model/entry-model";
import { AppConfig } from "../../app/app-config";
import { DummySingleEntry } from "./dummy-class-single-entry";


// Interface to define what this page needs implemented in order to work
export interface SingleEntryInterface {
  getEntry: (id: number) => Entry;
}

/**
 * Generated class for the SingleEntryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-single-entry',
  templateUrl: 'single-entry.html',
})
export class SingleEntryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleEntryPage');
  }

  private dummyObject: DummySingleEntry = new DummySingleEntry();
  private entry: Entry = this.dummyObject.getEntry(1);

}
