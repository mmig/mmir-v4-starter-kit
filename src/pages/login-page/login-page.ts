import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';

import { UserAuthProvider, UserAuth } from './../../providers/user-auth';
import { ViewPage } from './../../models/ViewPage';
import { MmirProvider } from './../../providers/mmir';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})

export class LoginPage extends ViewPage {

  public user: UserAuth = {
    name: 'MMIG-User',
    password: 'mmig-user'
  }

  private _languange: string;
  public get language(): string {
    if(!this._languange && this.lang){
      this._languange = this.lang.getLanguage();
    }
    return this._languange;
  }

  private initialized: Promise<any>;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private authProvider: UserAuthProvider,
    params: NavParams,
    mmirProvider: MmirProvider
  ) {
    super(mmirProvider);

    let data = params.get('data');
    if(data && data.user){
      this.user = data.user;
    }

    this.initialized = new Promise<UserAuth>((resolve, reject) => {

      mmirProvider.ready().then(() => {
        let user = this.mmir.ModelManager.getModel('User').getInstance();
        if(user){

          this.authProvider.getUserAuth(user.getName()).then(registerdUser => {
            this.user.name = registerdUser.name;
            this.user.password= registerdUser.password;
            resolve(registerdUser);
          });

        } else {

          this.authProvider.addUserAuth(this.user.name, this.user.password).then(() => resolve(this.user));
        }
      });

    });

  }

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

  public handleClick(event, name){
    super.handleClick(event, name, this.user);
  }

  showLangMenu() {

    let alert = this.alertCtrl.create();
    alert.setTitle(this.lang.getText('choose_language'));
    alert.setCssClass('language-menu');

    let current: string = this.lang.getLanguage();
    let list: Array<string> = this.lang.getLanguages();
    let lang:string;
    for(let i=0, size = list.length; i < size; ++i){
      lang = list[i];
      alert.addInput({
        type: 'radio',
        label: lang,
        value: lang,
        checked: lang === current
      });
    }

    alert.addButton(this.lang.getText('buttonCancel'));
    alert.addButton({
      text: this.lang.getText('buttonOk'),
      handler: data => {
        console.log('selected language: ',data);
    		this.dlg.raise('language_choosen', {language: data});
      }
    });
    alert.present();
  }

  updateLanguage(newLang: string){
    this._languange = newLang;
  }

  login(data?: {name: string, password: string}){

  	let email = data && data.name? data.name : '';
  	let password = data && data.password? data.password : '';

  	this.verify(email,password).then(isValid => {

      if(isValid){

    		this.mmir.ModelManager.getModel('User').create(email);
    		this.dlg.raise("user_logged_in");

      } else {

        let alert = this.alertCtrl.create();
        alert.setTitle('Login Failed!');
        alert.setMessage('Wrong user name or password.\n\nDir you register?');
        alert.addButton(this.lang.getText('buttonOk'));
        alert.present();

    		this.dlg.raise("login_failed", {user: {name: email, password: password}});
    	}

  	});

  }

  verify(name: string, pw: string): Promise<boolean>{

    return new Promise<boolean>((resolve, reject) => {
      this.initialized.then(() => {
        this.authProvider.getUserAuth(name)
            .then(userAuth => resolve(userAuth.password === pw))
            .catch(err => resolve(false));
      }).catch(err => resolve(false));
    });

  }

}
