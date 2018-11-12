import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';

import {MmirModule, LanguageManager} from 'mmir';
import {MmirProvider, VoiceUIProvider} from './../../providers/mmir';

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
    private vuiCtrl: VoiceUIProvider,
    private ref: ChangeDetectorRef,
    private viewCtrl: ViewController
  ) {
    this.mmir = mmirProvider.mmir;
    this.mmir.ready(()=>{
      this._lang = this.mmir.lang;
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

  public select(lang: string, event: MouseEvent){
    // console.log('selected language ', lang);
    this.vuiCtrl.ctrl.triggerTouchFeedback(event || {type: 'click'});
    this.viewCtrl.dismiss(lang);
  }

  public dismiss(event: MouseEvent){
    this.vuiCtrl.ctrl.triggerTouchFeedback(event || {type: 'click'});
    this.viewCtrl.dismiss(null);
  }

  ngOnInit(){
    this._isInit = true;
  }

  ngOnDestroy(){
    this._isDestroyed = true;
  }
}
