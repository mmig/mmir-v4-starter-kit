import {ViewPage} from './../../models/ViewPage';
import {MmirModule} from './../../models/MmirInterfaces';
import {MmirProvider} from './../../providers/mmir';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})

export class LoginPage extends ViewPage {

  public user: {name: string, password: string} = {
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

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
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

}
