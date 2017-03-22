import {MmirModule, LanguageManager, InputManager} from './MmirInterfaces';
import {MmirProvider, IonicDialogManager} from './../providers/mmir';

export interface MmirAppModule extends MmirModule {
  app: any;
}

export interface MmirAppProvider extends MmirProvider {
  mmir: MmirAppModule;
}

export class ViewPage {

  protected mmir: MmirAppModule;

  protected _lang: LanguageManager;
  protected _inp: InputManager;
  protected _dlg: IonicDialogManager;

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

  constructor(
    mmirProvider: MmirProvider
  ) {
    this.mmir = (mmirProvider as MmirAppProvider).mmir;
  }

  public handleClick(event, name, data?){

    this.mmir.app.triggerClickFeedback();

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
}
