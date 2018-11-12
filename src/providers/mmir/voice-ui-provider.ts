import { Injectable } from '@angular/core';
import { MmirProvider , IonicMmirModule } from './mmir-provider';
import { PromptReader } from './io/PromptReader';
import { VoiceUIController } from './ctrl/VoiceUIController';

import { ReadingOptions } from '../../models/speech/SpeechData';//FIXME should not link to ../../model/..

@Injectable()
export class VoiceUIProvider {

  private vuiCtrl: VoiceUIController;
  private mmirProvider: MmirProvider;

  private _debug: boolean = false;
  private _initialized = false;

  public get mmir(): IonicMmirModule { return this.mmirProvider.mmir;}
  public get prompt(): PromptReader { return this.vuiCtrl.getPromptReader();}
  public get ctrl(): VoiceUIController { return this.vuiCtrl;}

  public get asrActive(): boolean {
    if(this._initialized){
      return this.vuiCtrl.asrActive;
    }
    return false;
  }

  public get ttsActive(): boolean {
    if(this._initialized){
      return this.vuiCtrl.ttsActive;
    }
    return false;
  }

  public get debug(): boolean { return this._debug; }
  public set debug(value: boolean) {
    this._debug = value;
    this.ctrl.debug = value;
  }

  constructor(mmirProvider: MmirProvider) {
    this.mmirProvider = mmirProvider;
    this.vuiCtrl = new VoiceUIController(mmirProvider);
  }

  public ready(): Promise<VoiceUIController> {
    return this.vuiCtrl.ready().then(() => {
      this._initialized = true;
      return this.vuiCtrl;
    });
  }

  public asrCancel(): void {
    if(this._initialized){
      this.vuiCtrl.asrCancel(this.vuiCtrl.isPermanentCommandMode);
    }
  }

  public ttsCancel(): void {
    if(this._initialized){
      this.vuiCtrl.ttsCancel();
    }
  }

  public cancel(): void {
    if(this._initialized){
      this.vuiCtrl.ttsCancel();
      this.vuiCtrl.asrCancel(this.vuiCtrl.isPermanentCommandMode);
    }
  }

  public readPrompt(promptData: ReadingOptions){
    if(this._initialized){
      this.mmir.dialog.raise('read-prompt', promptData);
    } else {
      this.ready().then(() => this.mmir.dialog.raise('read-prompt', promptData));
    }
  }

}
