
import { Injectable, Component } from '@angular/core';
import { Http } from '@angular/http';
import { Platform, Nav, Events } from 'ionic-angular';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { MmirModule, DialogEngine, DialogManager, PresentationManager } from './../models/MmirInterfaces';

import { AppConfig } from './app-config';

declare var mmir;//FIXME

var __mmir = mmir;

export interface IonicPresentationManager extends PresentationManager {
  _ionicNavCtrl: Nav;
}

export interface IonicDialogManager extends DialogManager {
  _perform;
  _raise;
  _eventEmitter: Events;
  _isDebugVui: boolean;
}

export interface IonicDialogEngine extends DialogEngine {
  worker;
}

export type ViewDecl = {name: string, ctrl: string, view: any};
export type ViewDef = {_name: string, getName: () => string, view: Component};

@Injectable()
export class MmirProvider {

  private platform: Platform;
  private nav: Nav;
  private evt: Events;
  private appConfig: AppConfig;

  private _mmir : MmirModule;

  private _initialize: Promise<MmirProvider>;

  //FLAG: should debug output for VUI (via dialog system) be shown in console
  private isDebugVui: boolean;

  public get mmir(){
    return this._mmir;
  }

  constructor(
    private http: Http
  ) {

    this._mmir = __mmir;

  }

  //FIXME find better way to "inject" dependencies
  public init(
    platform: Platform,
    nav: Nav,
    events: Events,
    appConfig: AppConfig,
    views?: Array<ViewDecl>
  ): Promise<MmirProvider> {

    this.platform = platform;
    this.nav = nav;
    this.evt = events;
    this.appConfig = appConfig;

    // apply setting for debug output:
    //  (technically we should wait for the promise to finish, but since this
    //   setting is not really important for how the class functions, we just
    //   continue anyway)
    this.isDebugVui = true;
  	this.appConfig.get('showVuiDebugOutput').then(isEnabled => {
  		this.isDebugVui = isEnabled;
      if(this.mmir && this.mmir.DialogManager){
        let dlg = this.mmir.DialogManager as IonicDialogManager;
        dlg._isDebugVui = isEnabled;
      }
  	});

    if(!this._initialize){
      this._initialize = this.mmirInit(views);
    }

    return this._initialize;
  }

  public ready(): Promise<MmirProvider> {
    if(!this._initialize){
      throw new Error('Must call init() first.');
    }
    return this._initialize;
  }

  private mmirInit(views?: Array<ViewDecl>): Promise<MmirProvider> {

    return new Promise<MmirProvider>((resolve, reject) => {
      this._mmir.ready(() => {

        this.platform.setLang(this.mmir.LanguageManager.getLanguage(), true);

        let presentMng: IonicPresentationManager = this.mmir.PresentationManager as IonicPresentationManager;
        presentMng._ionicNavCtrl = this.nav;

        if(views){
          let decl: ViewDecl;
          let view: ViewDef;
          for(let i=0,size = views.length; i < size; ++i){
            decl = views[i];
            view = this.mmirCreateView(decl.name, decl.view);
          	presentMng.addView(decl.ctrl, view);
          }
        }


        let dlg: IonicDialogManager = this.mmir.DialogManager as IonicDialogManager;
        dlg._perform = dlg.perform;//TODO do we need previous impl.?
        dlg._eventEmitter = this.evt;
        dlg._isDebugVui = this.isDebugVui;
        dlg.perform = function(ctrlName, actionName, data) {

          let target = ctrlName+':'+actionName;
          if (this.isDebugVui) console.log('DialogManager: emit action for '+target+' ', data);
          // this._eventEmitter.publish(target, data); FIXME: "convert" _perform to event-emitting?
          return this._perform.apply(this, arguments);
        };
        // dlg._raise = dlg.raise;
        // dlg.raise = function(eventName, eventData) {
        //   if(eventName === 'init'){
        //     //inject Events for inter-app communication:
        //     eventData.eventEmitter = this.evt;
        //   }
        //   this._raise.apply(this, arguments);
        // };


        let dlgEngine: IonicDialogEngine = this.mmir.DialogEngine as IonicDialogEngine;

        this.mmir.require(['emma'], (emma) => {

          //circumvent message-queue for init-event:
          // (this allows to pass non-stringified and -fyable object instances)
      		dlgEngine.worker._engineGen.call(dlgEngine.worker._engineInstance, 'init', {
            eventHandler: this.evt,
            appConfig: this.appConfig,
            mmir: this._mmir,
            emma: emma
          });

          resolve(this);

        }, err => reject(err));

      });

    });//END: new Promise()
  }

  private mmirCreateView(name: string, page: Component): ViewDef {//FIXME
    return {
      _name: name,
      getName: function(){
        return this._name;
      },
      view: page
    };
  }

}
