
import { MediaManager, DialogManager } from '../../../assets/mmirf/mmir.d';//'mmir';


import { ReadingData, StopReadingOptions } from '../../../models/speech/SpeechData';//FIXME do not link to ../../model/* ?
import { prepTts , prepareAcronyms , prepareAbbrevations , prepareDates , PromptType } from '../../../models/speech/PromptUtils';

export class PromptReader {

  protected _ttsActive: boolean;
  public get active(): boolean { return this._ttsActive; }

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

  public readStartPrompt(){

    //NOTE inserted comma after "Mikrofonsymbol" to improve TTS audio (i.e. inserts a short pause)
    let startPrompt = 'Bitte tippen Sie auf das Mikrophon-Symbol, und stellen Sie eine Frage.';

    this.doRead(startPrompt);
  }

  public readMessage(answerPrompt: ReadingData, promptType: PromptType){

    const size: number = answerPrompt.promptText.length;
    const main = size > 1? answerPrompt.promptText[1] : answerPrompt.promptText[0];
    const caption = size > 1 && answerPrompt.promptText[0] ? answerPrompt.promptText[0] : '';

    //split into sentences, so that TTS can start after audio for 1st sentence was prepared
    // (instead of waiting for audio of complete text)
    let sentences: Array<string> = this.prepareSentences(
      //improve reading of acronyms by "spelling them out"
      prepTts(prepareAcronyms(main)), promptType
    );

    // if(caption){
      sentences.unshift(prepTts(caption));
    // }

    this.doRead(sentences);
  }

  public readPrompt(answerPrompt: ReadingData, promptType: PromptType){

    //split into sentences, so that TTS can start after audio for 1st sentence was prepared
    // (instead of waiting for audio of complete text)
    let sentences: Array<string> = [];

    for(const part of answerPrompt.promptText){
      this.prepareSentences(
        //improve reading of acronyms by "spelling them out"
        prepTts(prepareAcronyms(part)), promptType, sentences
      );
    }

    this.doRead(sentences);
  }

  /**
   *
   * @param  [sentences] IN/OUT parameter: if specified, sentences will be appended to this array & it will be the return value
   * @return the (modified) sentences param, or if omitted a new string-array with the sentences
   */
  prepareSentences(text: string, promptType: PromptType, sentences?: Array<string>): Array<string>{

    sentences = sentences || [];

    //read dates "<number> ten" (i.e. not "as subject", i.e. not as "<number> ter")
    let useDateAsSubject: boolean = false;//promptType !== PromptType.PROMPT_DEADLINES;

    //split at ". ", i.e. <dot> FOLLOWED BY <white-space> OR <end>)
    let preparedText: string = prepareAbbrevations( prepareDates(text, useDateAsSubject));
    const splitText = preparedText.split(/\.(\s|$)/m);
    for(let s of splitText){

      s = s.trim();
      //omit empty strings:
      if(s){
        sentences.push(s);
      }
    }
    return sentences;
  }

  protected doRead(text: string|Array<string>){


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
