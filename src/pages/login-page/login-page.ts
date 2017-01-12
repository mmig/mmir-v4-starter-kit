import {ViewPage} from './../../models/ViewPage';
import {MmirModule} from './../../models/MmirInterfaces';
import {MmirProvider} from './../../providers/mmir';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})

export class LoginPage extends ViewPage {

  user: {name: string, password: string} = {
    name: 'MMIG-User',
    password: 'mmig-user'
  }

  constructor(
    public navCtrl: NavController,
    mmirProvider: MmirProvider
  ) {
    super(mmirProvider);
  }

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

  public handleClick(event, name){
    super.handleClick(event, name, this.user);
  }

}
