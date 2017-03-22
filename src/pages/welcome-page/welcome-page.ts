import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MmirProvider } from './../../providers/mmir';
import { ViewPage } from './../../models/ViewPage';

@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome-page.html'
})
export class WelcomePage extends ViewPage {

  public userModel;

  constructor(
    public navCtrl: NavController,
    ref: ChangeDetectorRef,
    mmirProvider: MmirProvider
  ) {
    super(mmirProvider, ref);
    this.userModel = this.mmir.ModelManager.getModel('User').getInstance();
  }

  ionViewDidLoad() {
    console.log('Hello WelcomePage Page');
  }

}
