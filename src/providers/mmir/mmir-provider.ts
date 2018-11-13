
import { Injectable, Component } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';

import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';

import { MmirModule , MediaManager } from '../../assets/mmirf/mmir.d';
import { ShowSpeechStateOptions, SpeechFeedbackOptions, RecognitionEmma, UnderstandingEmma , ReadingOptions , StopReadingOptions, ReadingShowOptions } from './typings/mmir-base-dialog.d';
import { EmmaUtil } from './typings/emma.d';
import { IAppSettings } from './typings/app-settings';
import { SpeechEventEmitter , IonicMmirModule , ViewDecl , IonicDialogEngine , IonicDialogManager , IonicView , PlayError , IonicPresentationManager , IonicController , Action , WaitReadyOptions } from './typings/mmir-ionic.d';


//FIXME should use import instead of declaring variable!
// import * as mmir from 'mmir';
declare var mmir;

var __mmir: MmirModule = mmir as MmirModule;

@Injectable()
export class MmirProvider<CmdType, CmdParam> {

  private platform: Platform;
  private nav: Nav;
  private evt: SpeechEventEmitter<CmdType, CmdParam>;
  private appConfig: IAppSettings;

  private _mmir : IonicMmirModule<CmdType, CmdParam>;

  private _initialize: Promise<MmirProvider<CmdType, CmdParam>>;
  private _readyWait: Promise<MmirProvider<CmdType, CmdParam>>;
  private _resolveReadyWait: (mmirProvider: MmirProvider<CmdType, CmdParam>) => void;
  private _readyWaitTimer: number;
  private readonly _readyWaitTimeout: number = 10 * 60 * 1000;//10 min.

  //FLAG: should debug output for VUI (via dialog system) be shown in console
  private isDebugVui: boolean;

  public get mmir(){
    return this._mmir;
  }

  constructor() {
    this._mmir = __mmir as IonicMmirModule<CmdType, CmdParam>;
  }

  //FIXME find better way to "inject" dependencies
  public init(
    platform: Platform,
    nav: Nav,
    appConfig: IAppSettings,
    views?: Array<ViewDecl>
  ): Promise<MmirProvider<CmdType, CmdParam>> {

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
      'changeMicLevels': new BehaviorSubject<SpeechFeedbackOptions>(
          {isStart: false, state: false, mode: 'command', inputMode: ''}//<-initial state
        ).distinctUntilChanged((state1: SpeechFeedbackOptions, state2: SpeechFeedbackOptions) => {
          return state1.isStart === state2.isStart && state1.state === state2.state && state1.mode === state2.mode && state1.inputMode === state2.inputMode && state1.targetId === state2.targetId;
        }),
      'waitReadyState': new BehaviorSubject<WaitReadyOptions>(
          {state: 'ready', module: ''}//<-initial state
        ).distinctUntilChanged((state1: WaitReadyOptions, state2: WaitReadyOptions) => {
          return state1.state === state2.state && state1.module === state2.module;
        }),
      'showDictationResult': new Subject<RecognitionEmma>(),
      'determineSpeechCmd': new Subject<RecognitionEmma>(),
      'execSpeechCmd': new Subject<UnderstandingEmma<CmdType, CmdParam>>(),
      'cancelSpeechIO': new Subject<void>(),
      'read': new Subject<string|ReadingOptions>(),
      'stopReading': new Subject<StopReadingOptions>(),
      'showReadingStatus': new BehaviorSubject<ReadingShowOptions>(
          {active: false, contextId: ''}//<-initial state
        ).distinctUntilChanged((state1: ReadingShowOptions, state2: ReadingShowOptions) => {
          if(state1.test || state2.test){
            return false;
          }
          return state1.active === state2.active && state1.contextId === state2.contextId &&
                  state1.readingId === state2.readingId && state1.targetId === state2.targetId &&
                  state1.readingData === state2.readingData;
        }),

      //TODO GuidedInput events?
      //'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed'

      'playError': new Subject<PlayError>()

    } as SpeechEventEmitter<CmdType, CmdParam>;

    // apply setting for debug output:
    //  (technically we should wait for the promise to finish, but since this
    //   setting is not really important for how the class functions, we just
    //   continue anyway)
    this.isDebugVui = true;
  	this.appConfig.get('showVuiDebugOutput').then(isEnabled => {
  		this.isDebugVui = isEnabled;
      if(this.mmir && this.mmir.dialog){
        let dlg = this.mmir.dialog as IonicDialogManager<CmdType, CmdParam>;
        dlg._isDebugVui = isEnabled;
      }
  	});

    if(!this._initialize){
      this._initialize = this.mmirInit(views);
    }

    return this._initialize;
  }

  public ready(): Promise<MmirProvider<CmdType, CmdParam>> {
    if(!this._initialize){

      if(!this._readyWait){

        console.log('Called MmirProvider.ready() before init(): waiting...');

        this._readyWait = new Promise<MmirProvider<CmdType, CmdParam>>((resolve, reject) => {

          //resolve "wait for ready":
          this._resolveReadyWait = (mmirProvider: MmirProvider<CmdType, CmdParam>) => {
            clearTimeout(this._readyWaitTimer);
            console.log('Resolved "wait for MmirProvider.ready()".');
            resolve(mmirProvider);
            this._readyWait = null;
            this._resolveReadyWait = null;
          };

          //set timeout for waiting to resolve:
          this._readyWaitTimer = setTimeout(() => {
            reject('Timed out waiting for MmirProvider initialization (exceeded timeout _readyWaitTimeout: '+this._readyWaitTimeout+' ms)');
          }, this._readyWaitTimeout);

        });

      }

      return this._readyWait;
    }
    return this._initialize;
  }

  public addViews(views: Array<ViewDecl>){

    const ctrlManager = this.mmir.ctrl;
    const presentMng = this.mmir.present;
    let ctrl: IonicController;
    let decl: ViewDecl;
    let view: IonicView;
    for(let i=0,size = views.length; i < size; ++i){
      decl = views[i];
      view = this.mmirCreateView(decl.name, decl.view);

      ctrl = ctrlManager.get(decl.ctrlName);
      if(!ctrl){
        ctrl = ctrlManager._createIonicController(decl.ctrlName, decl.name, decl.view);
      } else {
        ctrl.addView(decl.name, decl.view);
      }

      presentMng.addView(decl.ctrlName, view);
    }
  }

  private mmirInit(views?: Array<ViewDecl>): Promise<MmirProvider<CmdType, CmdParam>> {

    //promise for setting up mmir to work within angular/ionic
    return new Promise<MmirProvider<CmdType, CmdParam>>((resolve, reject) => {
      this._mmir.ready(() => {

        this.platform.setLang(this.mmir.lang.getLanguage(), true);

        this.mmir.media.on('errorplay', (audio, error) => {
          this.evt.playError.next({audio: audio, error: error});
        });

        const presentMng: IonicPresentationManager = this.mmir.present;
        presentMng._ionicNavCtrl = this.nav;
        presentMng._getIonicViewController = function(ctrl: IonicController){
          if(!ctrl) {
            return null;
          }
          const ionicViewController = this._ionicNavCtrl.getActive();
          if(!ionicViewController) {
            return null;
          }
          for(let viewName in ctrl._ionicViews){
            if(ionicViewController.instance.constructor == ctrl._ionicViews[viewName]){
              return ionicViewController.instance;
            }
          }
          return null;
        };

        const ctrlManager = this.mmir.ctrl;
        let ctrl: IonicController;
        if(views){
          this.addViews(views)
        }

        let ctrlList: Array<string> = ctrlManager.getNames();
        for(let i=ctrlList.length-1; i >= 0; --i){
          ctrl = ctrlManager.get(ctrlList[i]) as IonicController;
          ctrl._eventEmitter = new Subject<Action>();
        }

        const media: MediaManager = this.mmir.media;
        media.waitReadyImpl = {
          eventHandler: this.evt,
          preparing: function(module: string){
            this.eventHandler.waitReadyState.next({state: 'wait', module: module});
          },
          ready: function(module: string){
            this.eventHandler.waitReadyState.next({state: 'ready', module: module});
          }
        } as any;


        const dlg: IonicDialogManager<CmdType, CmdParam> = this.mmir.dialog;
        dlg._perform = dlg.perform;//TODO do we need previous impl.?
        dlg._eventEmitter = this.evt;
        dlg._isDebugVui = this.isDebugVui;
        dlg.perform = function(ctrlName: string, actionName: string, data: any) {

          let target = ctrlName+':'+actionName;
          if (this.isDebugVui) console.log('DialogManager: emit action for '+target+' ', data);
          let speechEmitter: Subject<any> = this._eventEmitter[actionName];
          if(speechEmitter){
            if(typeof data !== 'undefined'){
              speechEmitter.next(data);
            } else {
              speechEmitter.next();
            }
          } else {

            //if component has a function actionName -> invoke this action
            let ctrl = ctrlManager.get(ctrlName);//TODO make ctrlManager instance property
            //FIXME should we check the requested controller's views (i.e. if the current view is one of the controller's)
            //      or should we just use/check the current view?
            let activeCtrlView = presentMng._getIonicViewController(ctrl);//TODO make presentMng instance property
            if(activeCtrlView && activeCtrlView[actionName]){

              return activeCtrlView[actionName](data);//FIXME how should argument be handled? ... if view-function does not define arguments?

            } else {

              //default/fallback: invoke method on legacy controller
              return this._perform.apply(this, arguments);
            }
          }
        };

        let dlgEngine: IonicDialogEngine = this.mmir.dialogEngine;

        this.mmir.require(['emma'], (emma) => {

          //circumvent message-queue for init-event:
          // (this allows to pass non-stringified and non-stringifyable object instances)
      		dlgEngine.worker._engineGen.call(dlgEngine.worker._engineInstance, 'init', {
            eventHandler: this.evt,
            appConfig: this.appConfig,
            mmir: this._mmir,
            emma: emma
          });

          dlg._emma = emma as EmmaUtil;

          if(this._resolveReadyWait){
            this._resolveReadyWait(this);
          }

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
