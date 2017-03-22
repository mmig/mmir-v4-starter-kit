import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';

import {MmirModule, LanguageManager} from './../../models/MmirInterfaces';
import {MmirProvider} from './../../providers/mmir';

import {triggerClickFeedback} from '../../models/HapticFeedback';

@Component({
  selector: 'language-menu',
  templateUrl: 'language-menu.html'
})
export class LanguageMenu  implements OnInit, OnDestroy {

  private _isInit: boolean = false;
  private _isDestroyed: boolean = false;
  private mmir: MmirModule;

  private _lang: LanguageManager;

  public languages: Array<string> = [];
  public currentLanguage: string = '';

  constructor(
    private mmirProvider: MmirProvider,
    private ref: ChangeDetectorRef,
    private viewCtrl: ViewController
  ) {
    this.mmir = mmirProvider.mmir;
    this.mmir.ready(()=>{
      this._lang = this.mmir.LanguageManager;
      this.languages = this._lang.getLanguages();
      this.currentLanguage = this._lang.getLanguage();
      if(this._isInit && !this._isDestroyed){
        this.ref.detectChanges();
      }
    });
  }

  public localize(id: string): string {
    if(!this._lang){
      return '';
    } else {
      return this._lang.getText(id);
    }
  }

  public select(lang: string){
    // console.log('selected language ', lang);
    triggerClickFeedback();
    this.viewCtrl.dismiss(lang);
  }

  public dismiss(){
    triggerClickFeedback();
    this.viewCtrl.dismiss(null);
  }

  ngOnInit(){
    this._isInit = true;
  }

  ngOnDestroy(){
    this._isDestroyed = true;
  }
}
