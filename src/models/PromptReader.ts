
import { MediaManager, DialogManager } from 'mmir';
import { ReadingData } from './SpeechData';
import { prepareAcronyms , prepareAbbrevations , prepareDates , PromptType } from './PromptUtils';

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

  cancel(){
    this.media.cancelSpeech();
    if(this._ttsActive){
      this.setActive(false);
      this.dlg.raise('reading-stopped');
    }
  }

  public readStartPrompt(){

    //NOTE inserted comma after "Mikrofonsymbol" to improve TTS audio (i.e. inserts a short pause)
    let startPrompt = 'Bitte tippen Sie auf das Mikrophon-Symbol, und stellen Sie eine Frage.';

    this.doRead(startPrompt);
  }

  public readMessage(answerPrompt: ReadingData, promptType: PromptType){

    //split into sentences, so that TTS can start after audio for 1st sentence was prepared
    // (instead of waiting for audio of complete text)
    let sentences: Array<string> = this.prepareSentences(
      //improve reading of acronyms by "spelling them out"
      prepareAcronyms(answerPrompt.promptText[1]), promptType
    );

    sentences.unshift(answerPrompt.promptText[0]);

    this.doRead(sentences);
  }

  prepareSentences(text: string, promptType: PromptType): Array<string>{

    //read dates "<number> ten" (i.e. not "as subject", i.e. not as "<number> ter")
    let useDateAsSubject: boolean = false;//promptType !== PromptType.PROMPT_DEADLINES;

    //split at ". ", i.e. <dot> FOLLOWED BY <white-space> OR <end>)
    let sentences = prepareAbbrevations( prepareDates(text, useDateAsSubject)).split(/\.(\s|$)/m);
    for(let i=sentences.length - 1; i >= 0; --i){

      //remove empty entries from the array:
      if(!sentences[i].trim()){
        sentences.splice(i,1);
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

          // self.ttsActive(false);
          // console.debug('Synthesized ', text);
          self.dlg.raise('reading-stopped');

        },
        function onError(err){

          // self.ttsActive(false);
          // console.error('Could not synthesize ', text, ': '+err);
          self.dlg.raise('reading-stopped');

        },
        function onPrepared(){
          console.debug('prepared TTS audio, starting to read now... ', text);//DEBUG
        }
    );
  }

}
