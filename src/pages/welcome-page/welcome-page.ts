import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { MmirProvider , VoiceUIProvider } from './../../providers/mmir';
import { MmirPage } from './../../models/MmirBasePage';

@IonicPage()
@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome-page.html'
})
export class WelcomePage extends MmirPage {

  public userModel;

  constructor(
    public navCtrl: NavController,
    ref: ChangeDetectorRef,
    vuiCtrl: VoiceUIProvider<any, any>,
    mmirProvider: MmirProvider<any, any>
  ) {
    super(vuiCtrl, mmirProvider, ref);
    this.userModel = this.mmir.model.get('User').getInstance();
  }

  ionViewDidLoad() {
    console.log('Hello WelcomePage Page');
  }

}
