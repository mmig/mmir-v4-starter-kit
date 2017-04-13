
import { MediaManager, DialogManager } from './MmirInterfaces';
import { ReadingData } from './ISpeechInput';

export class PromptReader {

  // public static readonly PROMPT_RESULTS_FOUND = 'results-found-prompt';
  public static readonly PROMPT_WELCOME = 'welcome-prompt';
  public static readonly PROMPT_ANSWER = 'answer-prompt';


  protected _ttsActive: boolean;
  public get active(): boolean { return this._ttsActive; }

  /** if a prompt is active, when a new one is requested: cancel the current one, or discard the new one?  */ //TODO impl. queuing-mode for new prompts?
  public cancelOnNew: boolean;

  constructor(private dlg: DialogManager, private media: MediaManager){
    this._ttsActive = false;
    this.cancelOnNew = false;
  }

  public static isPromptId(id: string) : boolean {
    //TODO use enum for prompt IDs
    return id === PromptReader.PROMPT_WELCOME || id === PromptReader.PROMPT_ANSWER;//TODO: || id === PromptReader.PROMPT_RESULTS_FOUND;
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

  public readAnswer(answerPrompt: ReadingData){

    //split into sentences, so that TTS can start after audio for 1st sentence was prepared
    // (instead of waiting for audio of complete text)
    let sentences: Array<string> = this.prepareSentences(
      //improve reading of acronyms by "spelling them out"
      this.prepareAcronyms(answerPrompt.promptText)
    );

    this.doRead(sentences);
  }

  prepareAcronyms(text: string): string {

    const len = text.length;

    //replace "SUV" with explicit German pronounciation
    // text = text.replace(/\bSUV\b/g, 'Es Ju Wie,');TODO handle known special cases, that we know are treated incorretly by the TTS

    //try to space-out letters in acronyms:
    let re = /([ABCDEFGHIJKLMNOPQRSTUVWXYZ][ABCDEFGHIJKLMNOPQRSTUVWXYZ]+)/g;//<- RegExp for detecting acronyms (i.e. with 2 or more upper-case chars in a row)
    text = text.replace(re, (acronym, match1, index) => {

      //insert spaces between chars of detected acronym
      let pronounciation = acronym.split('').join(' ');

      //if acronym is followed by a whitespace, insert a comma (i.e. add a short pause for TTS)
      let nextCharPos = index + acronym.length;//<- really: index + (acronym.length - 1) + 1
      if(nextCharPos < len - 2 && /\s/.test(text.charAt(nextCharPos))){
        pronounciation += ',';
      }

      return pronounciation;
    });

    return text;
  }

  prepareSentences(text: string): Array<string>{
    //split at ". ", i.e. <dot> FOLLOWED BY <white-space> OR <end>)
    let sentences = text.split(/\.(\s|$)/m);
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

    this.media.textToSpeech(text,

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
