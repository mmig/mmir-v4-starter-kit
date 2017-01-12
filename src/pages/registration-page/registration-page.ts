import {ViewPage} from './../../models/ViewPage';
import { MmirModule } from './../../models/MmirInterfaces';
import { MmirProvider } from './../../providers/mmir';

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'registration-page',
  templateUrl: 'registration-page.html'
})

export class RegistrationPage extends ViewPage {

  user: {name: string, password: string} = {
    name: '',
    password: ''
  }

  constructor(
    public navCtrl: NavController,
    params: NavParams,
    mmirProvider: MmirProvider
  ) {
    super(mmirProvider);

    let user = params.get('data');
    if(user){
      this.user = user;
    }
  }

  ionViewDidLoad() {
    console.log('Hello RegistrationPage Page');
  }

  public handleClick(event, name){
    super.handleClick(event, name, this.user);
  }
}
