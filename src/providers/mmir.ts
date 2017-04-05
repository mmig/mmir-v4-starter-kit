import {ControllerManager} from './../models/MmirInterfaces';

import { Injectable, Component } from '@angular/core';
import { Http } from '@angular/http';
import { Platform, Nav } from 'ionic-angular';

import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';

// import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { MmirModule, DialogEngine, DialogManager, PresentationManager, Controller, View } from './../models/MmirInterfaces';
import { ShowSpeechStateOptions, ReadingOptions, ReadingShowOptions, StopReadingOptions, RecognitionEmma, UnderstandingEmma } from './../models/ISpeechInput';

import { AppConfig } from './app-config';

declare var mmir;//FIXME

var __mmir = mmir;

type SpeechEventName = 'showSpeechInputState' |                         //ISpeechState
                        'startMicLevels' | 'stopMicLevels' |            //ISpeechFeedback
                        'showDictationResult' |                         //ISpeechDictate
                        'determineSpeechCmd' | 'execSpeechCmd' |        //ISpeechCommand
                        'cancelSpeechIO' |                              //ISpeechInputProcessor
                        'read' | 'stopReading' | 'showReadingStatus' |  //ISpeechOutput
                        'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed' //IGuidedSpeechInput
                        ;
export interface SpeechEventEmitter {
    showSpeechInputState: BehaviorSubject<ShowSpeechStateOptions>;
    startMicLevels: BehaviorSubject<ShowSpeechStateOptions>;
    stopMicLevels: BehaviorSubject<ShowSpeechStateOptions>;
    showDictationResult: Subject<RecognitionEmma>;
    determineSpeechCmd: Subject<RecognitionEmma>;
    execSpeechCmd: Subject<UnderstandingEmma>;
    cancelSpeechIO: Subject<void>;
    read: Subject<string|ReadingOptions>;
    stopReading: Subject<StopReadingOptions>;
    showReadingStatus: BehaviorSubject<ReadingShowOptions>//;
    //'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed'
}

export interface IonicPresentationManager extends PresentationManager {
  _ionicNavCtrl: Nav;
  addView: (ctrlName: string, view: View|IonicView) => void;
  _getIonicViewController: (ctrl: IonicController) => Component;
}

export interface IonicControllerManager extends ControllerManager {
  _createIonicController: (ctrlName: string, viewName?: string, ionicViewCtrl?: any) => IonicController;
}

export interface IonicDialogManager extends DialogManager {
  _perform;
  _raise;
  _emma;
  _eventEmitter: SpeechEventEmitter;//{[id: string]: Subject<any>};//Events;
  _isDebugVui: boolean;
}

export interface IonicDialogEngine extends DialogEngine {
  worker;
}

export type Action = {name: string, data: any};
export interface IonicController extends Controller {
  _eventEmitter: Subject<Action>;
  _ionicViews: {[id:string]: IonicView};
  addView: (viewName:string, ionicView: any) => void;
}

export type ViewDecl = {name: string, ctrlName: string, view: any};
export type IonicView = {_name: string, getName: () => string, view: Component, ctrl?: IonicController};

@Injectable()
export class MmirProvider {

  private platform: Platform;
  private nav: Nav;
  private evt: SpeechEventEmitter;//{[id: string]: Subject<any>};//Events;
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
    // events: Events,
    appConfig: AppConfig,
    views?: Array<ViewDecl>
  ): Promise<MmirProvider> {

    this.platform = platform;
    this.nav = nav;
    // this.evt = events;
    this.appConfig = appConfig;

    this.evt = {
      'showSpeechInputState': new BehaviorSubject<ShowSpeechStateOptions>(
          {state: false, mode: 'command', inputMode: ''}//<-initial state
        ).distinctUntilChanged((state1: ShowSpeechStateOptions, state2: ShowSpeechStateOptions) => {
          return state1.state === state2.state && state1.mode === state2.mode && state1.inputMode === state2.inputMode && state1.targetId === state2.targetId;
        }),
      'startMicLevels': new BehaviorSubject<ShowSpeechStateOptions>(
          {state: false, mode: 'command', inputMode: ''}//<-initial state
        ),
      'stopMicLevels': new BehaviorSubject<ShowSpeechStateOptions>(
          {state: false, mode: 'command', inputMode: ''}//<-initial state
        ),
      'showDictationResult': new Subject<RecognitionEmma>(),
      'determineSpeechCmd': new Subject<RecognitionEmma>(),
      'execSpeechCmd': new Subject<UnderstandingEmma>(),
      'cancelSpeechIO': new Subject<void>(),
      'read': new Subject<string|ReadingOptions>(),
      'stopReading': new Subject<StopReadingOptions>(),
      'showReadingStatus': new BehaviorSubject<ReadingShowOptions>(
          {active: false, pageId: ''}//<-initial state
        ).distinctUntilChanged((state1: ReadingShowOptions, state2: ReadingShowOptions) => {
          if(state1.test || state2.test){
            return false;
          }
          return state1.active === state2.active && state1.pageId === state2.pageId &&
                  state1.readingId === state2.readingId && state1.targetId === state2.targetId &&
                  state1.readingData === state2.readingData;
        })//,

      //TODO GuidedInput events?
      //'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed'

    } as SpeechEventEmitter;

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

    //promise for setting up mmir to work within angular/ionic
    return new Promise<MmirProvider>((resolve, reject) => {
      this._mmir.ready(() => {

        this.platform.setLang(this.mmir.LanguageManager.getLanguage(), true);

        let presentMng: IonicPresentationManager = this.mmir.PresentationManager as IonicPresentationManager;
        presentMng._ionicNavCtrl = this.nav;
        presentMng._getIonicViewController = function(ctrl: IonicController){
          let ionicViewController = this._ionicNavCtrl.getActive();
          for(let viewName in ctrl._ionicViews){
            if(ionicViewController.instance.constructor == ctrl._ionicViews[viewName]){
              return ionicViewController.instance;
            }
          }
          return null;
        };

        let ctrlManager = this.mmir.ControllerManager as IonicControllerManager;
        let ctrl: IonicController;
        if(views){
          let decl: ViewDecl;
          let view: IonicView;
          for(let i=0,size = views.length; i < size; ++i){
            decl = views[i];
            view = this.mmirCreateView(decl.name, decl.view);

            ctrl = ctrlManager.getController(decl.ctrlName) as IonicController;
            if(!ctrl){
              ctrl = ctrlManager._createIonicController(decl.ctrlName, decl.name, decl.view);
            } else {
              ctrl.addView(decl.name, decl.view);
            }

          	presentMng.addView(decl.ctrlName, view);
          }
        }

        let ctrlList: Array<string> = ctrlManager.getControllerNames();
        for(let i=ctrlList.length-1; i >= 0; --i){
          ctrl = ctrlManager.getController(ctrlList[i]) as IonicController;
          ctrl._eventEmitter = new Subject<Action>();
        }


        let dlg: IonicDialogManager = this.mmir.DialogManager as IonicDialogManager;
        dlg._perform = dlg.perform;//TODO do we need previous impl.?
        dlg._eventEmitter = this.evt;
        dlg._isDebugVui = this.isDebugVui;
        dlg.perform = function(ctrlName: string, actionName: string, data: any) {

          let target = ctrlName+':'+actionName;
          if (this.isDebugVui) console.log('DialogManager: emit action for '+target+' ', data);
          // this._eventEmitter.publish(target, data); FIXME: "convert" _perform to event-emitting?
          let speechEmitter: Subject<any> = this._eventEmitter[actionName];
          if(speechEmitter){
            if(typeof data !== 'undefined'){
              speechEmitter.next(data);
            } else {
              speechEmitter.next();
            }
          } else {

            //if component has a function actionName -> invoke this action
            let ctrl = ctrlManager.getController(ctrlName) as IonicController;//TODO make ctrlManager instance property
            //FIXME should we check the requested controller's views (i.e. if the current view is one of the controller's)
            //      or should we just use/check the current view?
            let activeCtrlView = presentMng._getIonicViewController(ctrl);//TODO make presentMng instance propperty
            if(activeCtrlView[actionName]){

              return activeCtrlView[actionName](data);//FIXME how should argument be handled? ... if view-function does not define arguments?

            } else {

              //default/fallback: invoke method on legacy controller
              return this._perform.apply(this, arguments);
            }
          }
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
          // (this allows to pass non-stringified and non-stringifyable object instances)
      		dlgEngine.worker._engineGen.call(dlgEngine.worker._engineInstance, 'init', {
            eventHandler: this.evt,
            appConfig: this.appConfig,
            mmir: this._mmir,
            emma: emma
          });

          dlg._emma = emma;

          resolve(this);

        }, err => reject(err));

      });

    });//END: new Promise()
  }

  private mmirCreateView(name: string, page: Component): IonicView {//FIXME
    return {
      _name: name,
      getName: function(){
        return this._name;
      },
      view: page
    };
  }

}
