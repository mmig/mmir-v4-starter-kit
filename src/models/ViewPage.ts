import {MmirModule, LanguageManager, InputManager, MediaManager, SemanticInterpreter} from './MmirInterfaces';
import {MmirProvider, IonicDialogManager} from './../providers/mmir';
import {ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import {PromptReader} from './PromptReader';
import {triggerClickFeedback} from './HapticFeedback';

export interface MmirAppModule extends MmirModule {
  app: any;
}

export interface MmirAppProvider extends MmirProvider {
  mmir: MmirAppModule;
}

export class ViewPage implements OnInit, OnDestroy {

  protected mmir: MmirAppModule;
  protected ref: ChangeDetectorRef;

  protected _lang: LanguageManager;
  protected _inp: InputManager;
  protected _dlg: IonicDialogManager;
  protected _media: MediaManager;
  protected _semantic: SemanticInterpreter;

  protected prompt: PromptReader;

  protected get lang(): LanguageManager {
    if(!this._lang){
      if(this.mmir && this.mmir.LanguageManager){
        this._lang = this.mmir.LanguageManager;
      } else {
        return null;
      }
    }
    return this._lang;
  }

  protected get inp(): InputManager {
    if(!this._inp){
      if(this.mmir && this.mmir.InputManager){
        this._inp = this.mmir.InputManager;
      } else {
        return null;
      }
    }
    return this._inp;
  }

  protected get dlg(): IonicDialogManager {
    if(!this._dlg){
      if(this.mmir && this.mmir.DialogManager){
        this._dlg = this.mmir.DialogManager as IonicDialogManager;
      } else {
        return null;
      }
    }
    return this._dlg;
  }

  protected get media(): MediaManager {
    if(!this._media){
      if(this.mmir && this.mmir.MediaManager){
        this._media = this.mmir.MediaManager;
      } else {
        return null;
      }
    }
    return this._media;
  }

  protected get semantic(): SemanticInterpreter {
    if(!this._semantic){
      if(this.mmir && this.mmir.SemanticInterpreter){
        this._semantic = this.mmir.SemanticInterpreter;
      } else {
        return null;
      }
    }
    return this._semantic;
  }

  protected _asrActive: boolean = false;
  protected _isInit: boolean = false;
  protected _isDestroyed: boolean = false;

  public get asrOn(){ return this._asrActive; }
  public get ttsOn() { return this.prompt? this.prompt.active : false; }


  constructor(
    mmirProvider: MmirProvider,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mmir = (mmirProvider as MmirAppProvider).mmir;
    this.ref = changeDetectorRef;

    mmirProvider.ready().then(() => {
      this.prompt = new PromptReader(this.dlg, this.media);
    });
  }

  public handleClick(event, name, data?){

    this.triggerTouchFeedback();

		// this.inp.raise('touch_input_event');
		// this.inp.raise('click_on_' + name, data);
    let emmaEvt = this.dlg._emma.toEmma(event, data);
    this.dlg._emma._setEmmaFuncData(emmaEvt, 'understanding', {
      name: name,
      data: data
    });
    // this.dlg._emma.addTarget(emmaEvt, name, true);
    // this.dlg._emma.addProperty(emmaEvt, 'data', data, true);
    console.log(emmaEvt);
    this.inp.raise('touch', emmaEvt);
  }

  public localize(res: string) : string {
    if(this.lang){
      return this.lang.getText(res);
    } else {
      // console.info('mmir.LanguageManager not ready yet...');
      return '';
    }
  }

  public evalSemantics(asr_result: string){//TODO use emma-recognition event as input

    this.semantic.getASRSemantic(asr_result, null, result => {

      var semantic;
      if(result.semantic != null) {
        semantic = result.semantic;
        semantic.phrase = asr_result;
        console.log("semantic : " + result.semantic);//DEBUG
      }
      else {

        //create "no-match" semantic-object:
        semantic = {
          "NoMatch": {
            "phrase": asr_result
          }
        };
      }
      //TODO create emma-understanding event
      this.inp.raise("speech_input_event",  semantic);

    });

  }

  public triggerTouchFeedback(){
    triggerClickFeedback();
  }

  ////////////////////////////////////////// Speech IO ////////////////////////

  public microClicked(event, btnId: string){

    event.preventDefault();

    console.log('microClicked');

    // if(!isSyntheticClick(event))
    this.triggerTouchFeedback();

    this.dlg.raise('toggleSpeechInputState', {mode: 'command', targetId: btnId});
	  this.dlg.raise('showSpeechState');

    this.asrActive(true);//FIXME
  }

  public asrActive(isActive?: boolean) : boolean {

    if(typeof isActive !== 'undefined'){

      if(this._asrActive !== isActive){

        this._asrActive = isActive;
        console.log('set asr active -> '+this._asrActive);//DEBUG
        this.detectChanges();

        // if(!isActive){
        //
        //   this.hideAsr();
        //
        //   // //WARNING: currently, TTS-request are not queued, but discared if TTS is already active
        //   // //         if that should change, this invocation needs to be adjusted too!
        //   // this.readResults();
        // } else {
        //
        //   this.showAsr('Spracheingabe gestartet...');
        // }
      }
    }

    return this._asrActive;
  };

  public asrCancel(){
    this.media.cancelRecognition();
    this._asrActive = false;
  }

  public ttsClicked(event){

    if(this.asrActive()){
      this.asrCancel();
    }

    if(this.prompt.active){
      this.prompt.cancel();
    }
    // else {
    //   this.read(defaultPrompt);
    // }
  }

  ///////////////////////////////////////////////////

  //HELPER for savely requesting Angular to detect changes
  protected detectChanges(){
    if(this._isInit && ! this._isDestroyed){
      this.ref.detectChanges()
    }
  }

  ngOnInit(){
    this._isInit = true;
  }

  ngOnDestroy(){
    this._isDestroyed = true;
    this.media.cancelSpeech();
    this.media.cancelRecognition();
  }
}
