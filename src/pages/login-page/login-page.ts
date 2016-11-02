import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})

export class LoginPage {

  user: {name: string, password: string} = {
    name: '',
    password: ''
  }

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

}
