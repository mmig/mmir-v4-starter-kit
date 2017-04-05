
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController, ModalController, NavParams } from 'ionic-angular';

import { LanguageMenu } from './../../components/language-menu/language-menu';

import { UserAuthProvider, UserAuth } from './../../providers/user-auth';
import { MmirPage } from './../../models/MmirBasePage';
import { MmirProvider } from './../../providers/mmir';
import { ShowSpeechStateOptions } from '../../models/ISpeechInput';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})

export class LoginPage extends MmirPage {

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
    private modalCtrl: ModalController,
    private authProvider: UserAuthProvider,
    ref: ChangeDetectorRef,
    params: NavParams,
    mmirProvider: MmirProvider
  ) {
    super(mmirProvider, ref);

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

  protected showSpeechInputState(options: ShowSpeechStateOptions): void {
    console.info('overriden showSpeechInputState, invoking method on super...');
    super.showSpeechInputState(options);
  }

  ionViewCanEnter() {
    console.log('Hello LoginPage Page');
    return super.ionViewCanEnter();
  }

  public handleClick(event, name){
    super.handleClick(event, name, this.user);
  }

  showLangMenu() {
    let languageDialog = this.modalCtrl.create(LanguageMenu);
    languageDialog.onDidDismiss(data => {
      // console.log(data);
      if(data){
        this.dlg.raise('language_choosen', {language: data});
      } else {
        console.info('closed language-menu without seletion');
      }
    });
    languageDialog.present();
  }

  updateLanguage(newLang: string){
    this._languange = newLang;
    //this function may get invoked asynchronously -> request change detection for updating localize() strings
    this.detectChanges();
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
