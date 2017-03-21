import { MmirProvider } from './../../providers/mmir';
import { ViewPage } from './../../models/ViewPage';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome-page.html'
})
export class WelcomePage extends ViewPage {

  constructor(
    public navCtrl: NavController,
    mmirProvider: MmirProvider
  ) {
    super(mmirProvider);
  }

  ionViewDidLoad() {
    console.log('Hello WelcomePage Page');
  }

}
