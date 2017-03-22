import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { UserAuthProvider } from './../../providers/user-auth';
import { ViewPage } from './../../models/ViewPage';
import { MmirProvider } from './../../providers/mmir';

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
    private alertCtrl: AlertController,
    private userAuth: UserAuthProvider,
    ref: ChangeDetectorRef,
    params: NavParams,
    mmirProvider: MmirProvider
  ) {
    super(mmirProvider, ref);

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

  register(data?: {name: string, password: string}){

  	let email = data && data.name? data.name : '';
  	let password = data && data.password? data.password : '';

    if(email && password){

    	this.user[email]= password;
    	this.mmir.ModelManager.getModel('User').create(email);

      this.userAuth.addUserAuth(email, password)
          .then(() => this.dlg.raise('user_registered'))
          .catch(err => console.error(err));

    } else {

      let alert = this.alertCtrl.create();
      alert.setTitle('Registering Failed!');
      alert.setMessage('Invalid user name or password.');
      alert.addButton(this.lang.getText('buttonOk'));
      alert.present();

      //FIXME need to reset this.mmir.ModelManager.getModel('User').getInstance()!!!

      this.dlg.raise('user_registered', {user: {name: name, password: password}});
    }

  }

}
