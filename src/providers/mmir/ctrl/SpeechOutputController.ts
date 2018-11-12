
import { SpeechEventSubscription } from '../io/ISpeechIO';
import { PromptReader } from '../io/PromptReader';
import { MmirProvider } from '../mmir-provider';

import { ReadingShowOptions , ReadingOptions , StopReadingOptions } from '../../../models/speech/SpeechData';
import { isPromptId , PromptType } from '../../../models/speech/PromptUtils';
import { SubscriptionUtil } from '../util/SubscriptionUtil';

export class SpeechOutputController {

  protected prompt: PromptReader;

  protected _debugMsg: boolean = false;

  protected _speechEventSubscriptions: SpeechEventSubscription = {
      'read': null
  };

  public get debug(): boolean { return this._debugMsg; }
  public set debug(value: boolean) {
    this._debugMsg = value;
  }

  constructor(
    protected subsUtil: SubscriptionUtil,
    mmirProvider: MmirProvider
  ) {

    mmirProvider.ready().then(mmirp => {

      const mmir = mmirp.mmir;
      this.prompt = new PromptReader(mmir.dialog, mmir.media);
      this.subsUtil.subscribe(this._speechEventSubscriptions, this);

    });
  }

  public destroy() {
    this.subsUtil.unsubscribe(this._speechEventSubscriptions);
  }
  ////////////////////////////////////////// Speech Output Event Handlers ///////////////////////


  /**
   * Called when text should should be read.
   *
   * When reading starts, the function must trigger the "reading-started" event:
   *
   * <pre>
   * mmir.DialogManager.raise('reading-started')
   * </pre>
   *
   * After reading the text (or an error occured, preventing to read the text),
   * the function must trigger the "reading-stopped" event:
   *
   * <pre>
   * mmir.DialogManager.raise('reading-stopped')
   * </pre>
   *
   *
   * @param  {string|ReadingOptions} data the data for determining the text the should be read
   *                                      (if string: corresponds to the ReadingOptions.dialogId)
   *
   * @returns {void|boolean} if data.test === true, the function return TRUE, if the
   *                            reading-request is valid (e.g. if reading is context-sensitive)
   */
  protected read(data: string|ReadingOptions): void | boolean {

    if(this._debugMsg) console.log('read -> ', data);

    let isConsumed = false;
    let isTest = false;
    if(typeof data !== 'string'){

      isTest = data.test;

      if(typeof data.readingId == 'number' && isPromptId(data.readingId)){

        if(isTest){
          return true;/////////////////// EARYL EXIT ///////////////////
        }

        isConsumed = true;

        if(data.readingId === PromptType.PROMPT_WELCOME){

          this.prompt.readStartPrompt();

        } else if(data.readingId === PromptType.PROMPT_RESULTS){

          this.prompt.readMessage(data.readingData, data.readingId);

        } else if(data.readingId === PromptType.PROMPT_ERROR){

          //TODO impl. function for reading appointment?
          this.prompt.readPrompt(data.readingData, data.readingId);

        } else {
          isConsumed = false;
          console.error('requested to read unkown prompt: "'+data.readingId+'"');
        }

      }
    }

    if(!isConsumed && !isTest){
      console.error('read: unknown read target ', data);
    }

    return false;
  };

}
