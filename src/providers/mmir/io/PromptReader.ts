
import { MediaManager, DialogManager } from 'mmir';
import { ReadingData, StopReadingOptions } from '../typings/mmir-base-dialog';
import { IPromptHandler } from '../typings/mmir-ionic.d';

export class PromptReader {

  protected _ttsActive: boolean;
  public get active(): boolean { return this._ttsActive; }

  public handler: IPromptHandler;

  /** if a prompt is active, when a new one is requested: cancel the current one, or discard the new one?  */ //TODO impl. queuing-mode for new prompts?
  public cancelOnNew: boolean;

  constructor(private dlg: DialogManager, private media: MediaManager){
    this._ttsActive = false;
    this.cancelOnNew = false;
  }

  public setActive(newState?: boolean) : boolean {
    if(typeof newState !== 'undefined' && this._ttsActive !== newState){
      this._ttsActive = newState;
      // console.log('set tts active -> '+this._ttsActive);
    }
    return this._ttsActive;
  }

  cancel(options?: StopReadingOptions){
    this.media.cancelSpeech();
    if(this._ttsActive){
      if(!(options && options.continuesReading)){//do not send status-updates, if there is a "next reading"
        this.setActive(false);
        this.dlg.raise('reading-stopped');
      }
    }
  }

  public setHandler(handler: IPromptHandler): void {
    this.handler = handler;
  }

  public readPrompt(text: string|Array<string>): void {
    this.doRead(text);
  }

  protected doRead(text: string|Array<string>): void {


    //do not start/queue, if TTS is active right now, but discard the read-request
    //NOTE if this should be changed (i.e. not discarded), then asrActive(boolean) need to be changed too!
    if(this._ttsActive){

      if(!this.cancelOnNew){

        console.log('doReadResults(): did not synthesize, beceause TTS is active now, discarded TTS text');//DEBUG
        return;//////////////// EARLY EXIT /////////////

      } else {

        //cancel any ongoing TTS
        this.media.cancelSpeech();
      }
    }

    this.dlg.raise('reading-started');
    var self = this;

    this.media.tts(text,

        function onFinished(){

          // console.warn('doRead: finished reading ', text);//DEBU
          self.dlg.raise('reading-stopped');

        },
        function onError(err){

          // console.warn('doRead: error reading ', text, ' -> ', err);//DEBU
          self.dlg.raise('reading-stopped');

        },
        function onPrepared(){
          console.debug('prepared TTS audio, starting to read now... ', text);//DEBUG
        }
    );
  }

}
