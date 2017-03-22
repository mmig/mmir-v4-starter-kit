
import {MediaManager} from './MmirInterfaces';
import {DialogManager} from './MmirInterfaces';

export class PromptReader {

  // public static readonly PROMPT_RESULTS_FOUND = 'results-found-prompt';
  // public static readonly PROMPT_WELCOME = 'welcome-prompt';
  // public static readonly PROMPT_TEST_DRIVE = 'test-drive-prompt';

  protected _ttsActive: boolean;

  public get active(): boolean { return this._ttsActive; }

  constructor(private dlg: DialogManager, private media: MediaManager){
    this._ttsActive = false;
  }

  public static isPromptId(id: string) : boolean {
    //TODO use enum for prompt IDs
    // return id === PromptReader.PROMPT_RESULTS_FOUND || id === PromptReader.PROMPT_WELCOME || id === PromptReader.PROMPT_TEST_DRIVE;
    return false;
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

    //NOTE inserted comma after "Mikrofonsymbol" to improve TTS audio
    let startPrompt = 'Bitte tippen Sie auf das Mikrophon-Symbol, und nennen Sie die gewünschten Eigenschaften.';

    this.doRead(startPrompt);
  }

  prepareAcronyms(text: string): string {

    const len = text.length;

    //replace "SUV" with explicit German pronounciation
    text = text.replace(/\bSUV\b/g, 'Es Ju Wie,');

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

  protected doRead(text: string|Array<string>){


    //do not start/queue, if TTS is active right now, but discard the read-request
    //NOTE if this should be changed (i.e. not discarded), then asrActive(boolean) need to be changed too!
    if(this._ttsActive){
      console.log('doReadResults(): did not synthesize, beceause TTS is active now, discarded TTS text');//DEBUG
      return;//////////////// EARLY EXIT /////////////
    }

    this.dlg.raise('reading-started');
    var self = this;
    // //DISABLED: do not start TTS, if alreay active instead (see above)
    // //cancel any ongoing TTS (or should we abort, if one is active instead?)
    // this.media.cancelSpeech();
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
