import {MmirModule} from './MmirInterfaces';
import {MmirProvider} from './../providers/mmir';

export interface MmirAppModule extends MmirModule {
  app: any;
}

export interface MmirAppProvider extends MmirProvider {
  mmir: MmirAppModule;
}

export class ViewPage {

  protected mmir: MmirAppModule;

  constructor(
    mmirProvider: MmirProvider
  ) {
    this.mmir = (mmirProvider as MmirAppProvider).mmir;
  }

  public handleClick(event, name, data?){

    this.mmir.app.triggerClickFeedback();

		this.mmir.InputManager.raise('touch_input_event');
		this.mmir.InputManager.raise('click_on_' + name, data);
  }

  public localize(res: string) : string {
    if(this.mmir && this.mmir.LanguageManager){
      return this.mmir.LanguageManager.getText(res);
    } else {
      console.warn('mmir.LanguageManager not ready yet...');
      return '';
    }
  }
}
