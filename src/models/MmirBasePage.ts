import {LanguageManager, InputManager, MediaManager, SemanticInterpreter} from 'mmir';
import {ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RecognitionEmma , UnderstandingEmma , ShowSpeechStateOptions } from 'mmir-base-dialog';
import { ReadingOptions , StopReadingOptions , ReadingShowOptions } from './speech/SpeechData';
import { isPromptId, PromptType } from './speech/PromptUtils';
import { MmirProvider , IonicDialogManager , IonicMmirModule } from '../providers/mmir/mmir-provider';
import { SpeechEventSubscription } from '../providers/mmir/io/ISpeechIO';
import { SpeechFeedbackOptions } from '../providers/mmir/typings/mmir-base-dialog.d';
import { PromptReader } from '../providers/mmir/io/PromptReader';
import { VoiceUIProvider } from '../providers/mmir/voice-ui-provider';

export class MmirPage implements OnInit, OnDestroy {

  protected _mmirProvider: MmirProvider;

  protected mmir: IonicMmirModule;
  protected ref: ChangeDetectorRef;

  protected _lang: LanguageManager;
  protected _inp: InputManager;
  protected _dlg: IonicDialogManager;
  protected _media: MediaManager;
  protected _semantic: SemanticInterpreter;

  protected prompt: PromptReader;

  protected isActiveView = false;

  protected get lang(): LanguageManager {
    if(!this._lang){
      if(this.mmir && this.mmir.lang){
        this._lang = this.mmir.lang;
      } else {
        return null;
      }
    }
    return this._lang;
  }

  protected get inp(): InputManager {
    if(!this._inp){
      if(this.mmir && this.mmir.input){
        this._inp = this.mmir.input;
      } else {
        return null;
      }
    }
    return this._inp;
  }

  protected get dlg(): IonicDialogManager {
    if(!this._dlg){
      if(this.mmir && this.mmir.dialog){
        this._dlg = this.mmir.dialog as IonicDialogManager;
      } else {
        return null;
      }
    }
    return this._dlg;
  }

  protected get media(): MediaManager {
    if(!this._media){
      if(this.mmir && this.mmir.media){
        this._media = this.mmir.media;
      } else {
        return null;
      }
    }
    return this._media;
  }

  protected get semantic(): SemanticInterpreter {
    if(!this._semantic){
      if(this.mmir && this.mmir.semantic){
        this._semantic = this.mmir.semantic;
      } else {
        return null;
      }
    }
    return this._semantic;
  }

  protected _asrActive: boolean = false;
  protected _isInit: boolean = false;
  protected _isDestroyed: boolean = false;

  protected _debugMsg: boolean = true;

  public get asrOn(){ return this._asrActive; }
  public get ttsOn() { return this.prompt? this.prompt.active : false; }

  protected _speechEventSubscriptions: SpeechEventSubscription = {
      'showSpeechInputState': null,
      'changeMicLevels': null,
      'showDictationResult': null,
      'determineSpeechCmd': null,
      'execSpeechCmd': null,
      'cancelSpeechIO': null,
      'read': null,
      'stopReading': null,
      'showReadingStatus': null//;
      //'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed'
  };

  constructor(
    protected vuiCtrl: VoiceUIProvider,
    mmirProvider: MmirProvider,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this._mmirProvider = (mmirProvider as MmirProvider);
    this.mmir = this._mmirProvider.mmir;
    this.ref = changeDetectorRef;

    vuiCtrl.ready().then(() => {
      this.prompt = vuiCtrl.prompt;
    });
  }

  public ionViewCanEnter() {
    this.isActiveView = true;
    this._mmirProvider.ready().then( () => {
      if(this.isActiveView === false){
        return;
      }
      const keys = Object.keys(this._speechEventSubscriptions);
      const selfPage = this;
      keys.forEach(name => {
        this._speechEventSubscriptions[name] = this.dlg._eventEmitter[name].subscribe(function() {
          //DEBUG
          // let args = arguments.length === 1? arguments[0] : (arguments.length? arguments.length : void(0));
          // console.log(name +' -> ', args);
          if(selfPage[name]){
            selfPage[name].apply(selfPage, arguments);
          } else {
            console.warn('No function "'+name+'" in View available!');
          }
        });
      })
    });
    return true;
  }

  public ionViewCanLeave() {

    this.isActiveView = false;

    const keys = Object.keys(this._speechEventSubscriptions);
    let subname: string;
    for(let i = keys.length - 1; i >= 0; --i){
      subname = keys[i];
      if(this._speechEventSubscriptions[subname]){
        this._speechEventSubscriptions[subname].unsubscribe();
      }
    }

    return true;
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
    if(this._debugMsg) console.log(emmaEvt);
    this.inp.raise('touch', emmaEvt);
  }

  public localize(res: string) : string {
    if(this.lang){
      return this.lang.getText(res);
    } else {
      //if(this._debugMsg) console.info('mmir.LanguageManager not ready yet...');
      return '';
    }
  }

  public evalSemantics(asr_result: string, emmaEvent: RecognitionEmma){//TODO use emma-recognition event as input

    this.semantic.interpret(asr_result, null, result => {

      let semantic;
      if(result.semantic) {
        semantic = result.semantic;
        semantic.phrase = asr_result;
        if(this._debugMsg) console.log("semantic : " + result.semantic);//DEBUG
      }
      else {

        //create "no-match" semantic-object:
        semantic = {
          "NoMatch": {
            "phrase": asr_result
          }
        };
      }

      this.dlg._emma._setEmmaFuncData(emmaEvent, 'understanding', semantic);
      this.inp.raise('speech', emmaEvent);

    });

  }

  public triggerTouchFeedback(){
    this.vuiCtrl.ctrl.triggerTouchFeedback({type: 'click'});
  }

  protected getPageId(): string {
    return this.constructor.name;
  }

  ////////////////////////////////////////// Speech IO ////////////////////////

  public microClicked(event, btnId: string){

    event.preventDefault();

    //if(this._debugMsg) console.log('microClicked');

    if(this.prompt.active){
      this.prompt.cancel();
    }

    // if(!isSyntheticClick(event))//TODO detect programatically triggered invocations of this function?
    this.triggerTouchFeedback();

    this.dlg.raise('toggleSpeechInputState', {mode: 'command', targetId: btnId});
	  this.dlg.raise('showSpeechState');
  }


  public ttsClicked(event){

    event.preventDefault();

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

  public asrActive(isActive?: boolean) : boolean {

    if(typeof isActive !== 'undefined'){

      if(this._asrActive !== isActive){

        this._asrActive = isActive;
        if(this._debugMsg) console.log('set asr active -> '+this._asrActive);//DEBUG
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
    this.vuiCtrl.asrCancel();
    this._asrActive = false;
  }

  ////////////////////////////////////////// Speech Feedback Handler ////////////////////////

  protected showSpeechInputState(options: ShowSpeechStateOptions): void {
    if(this._debugMsg) console.log('showSpeechInputState -> ', options);
    this._asrActive = options.state;
    this.detectChanges();
  };

  protected showReadingStatus(options: ReadingShowOptions): void {
    if(this._debugMsg) console.log('showReadingStatus -> ', options);
    if(this.prompt){
      this.prompt.setActive(options.active);
      this.detectChanges();
    }
  };

  /**
   * If <code>options.isStart === true</code>:
   * Called when GUI should show indicator for Microphone input levels.
   *
   * This should also initialize/start listening to mic-levels changes, e.g.
   * register a listener:
   * <pre>
   * mmir.MediaManager.on('miclevelchanged', miclevelsChandeHandler);
   * </pre>
   * where miclevelsChandeHandler:
   *    function(micLevel: number)
   *
   *
   * If <code>options.isStart === false</code>:
   * Called when GUI should hide/deactivate indicator for Microphone input levels.
   *
   * This should destroy/free resource that were set up for visualizing mic-level
   * changes, e.g. could stop listening to mic-level changes, i.e. unregister listener:
   * <pre>
   * mmir.MediaManager.off('miclevelchanged', miclevelsChandeHandler);
   * </pre>
   *
   * @param {SpeechFeedbackOptions} options
   *              the data specifying the (changed) speech input state etc.
   */
  protected changeMicLevels(options: SpeechFeedbackOptions): void{
    if(this._debugMsg) console.log('changeMicLevels -> ', options);
  };

  ////////////////////////////////////////// Speech Input Event Handler ////////////////////////

  /**
   * Called for processing dictated text.
   *
   * E.g. text could  be visualized/shown in GUI, and/or stored internally etc.
   *
   * @param  {RecognitionEmma} emma the EMMA event contain an ASR result(s) from
   *                                 speech recognition.
   */
  protected showDictationResult(asrEmmaEvent: RecognitionEmma): void {
    if(this._debugMsg) console.log('showDictationResult -> ', asrEmmaEvent);
  }

  /**
   * Called for determining the understanding of an ASR result.
   *
   * E.g. apply a grammar to the ASR text, or keyword spotting, or some other
   * kind of "natural language understanding" (NLU).
   *
   * With the NLU result, this function should invoke
   * <pre>
   * InputManager.raise('speech', understandingResult);
   * </pre>
   * for the understood ASR, where understandingResult should have type UnderstandigResult.
   *
   * NOTE: for "not understood" ASR text, there could be a corresponding Command
   *       (i.e. calling InputManager.raise('speech', notUnderstoodCmd)) or some
   *       other form of feedback/processing should be triggered.
   *
   * @param  {RecognitionEmma} emma the EMMA event contain an ASR result(s) from
   *                                 speech recognition.
   */
  protected determineSpeechCmd(asrEmmaEvent: RecognitionEmma): void {
    if(this._debugMsg) console.log('determineSpeechCmd -> ASR: ', asrEmmaEvent);
    const asr = this.dlg._emma._extractAsrData(asrEmmaEvent);
    if(asr && (asr.type === 'INTERMEDIATE' || asr.type === 'FINAL')){
      this.evalSemantics(asr.text, asrEmmaEvent);
    }
  }

  /**
   * Called for "applying" an understood command.
   *
   * This function should select the "best" command(s) from semanticEmmaEvent and
   * execute it/them.
   *
   * When selecting / before executing, it should be checked, if the commands can
   * actually be executed.
   *
   * If no "best" command can be selected/executed, this function should instead invoke
   * a diambiguation dialog (when there are some potential, but no clear command candiates)
   * or a feedback should be triggerd, stating that there was no corresponding command
   * found for the user input.
   *
   * @param  {semanticEmmaEvent} emma the EMMA event contain an understanding result with a list
   *                                    understood Cmd(s)
   */
  protected execSpeechCmd(semanticEmmaEvent: UnderstandingEmma): void {
    if(this._debugMsg) console.log('execSpeechCmd -> ', semanticEmmaEvent);
    const cmd = this.dlg._emma._extractEmmaFuncData(semanticEmmaEvent, 'understanding');
    if(this._debugMsg) console.log('execSpeechCmd -> COMMAND: ', cmd);
    if(cmd){
      let sentences: Array<string>;
      if(cmd && cmd.NoMatch){
        sentences = [this.lang.getText('did_not_understand_msg'), this.lang.getText('command') + ': ' + cmd.NoMatch.phrase];
      } else {
        sentences = [cmd.phrase];
      }
      this.vuiCtrl.readPrompt({dialogId: this.getPageId(), readingId: PromptType.PROMPT_ERROR, readingData: {promptText: sentences}});
    }
  };

  /**
   * Called when speech input (ASR; recogintion) AND speech output (TTS; synthesis)
   * should be stopped.
   */
  protected cancelSpeechIO(): void {
    if(this._debugMsg) console.log('cancelSpeechIO -> ()');
    this.vuiCtrl.cancel();
  };

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

      if(isPromptId(data.readingId)){

        if(isTest){
          return true;/////////////////// EARYL EXIT ///////////////////
        }

        isConsumed = true;

        if(data.readingId === PromptType.PROMPT_WELCOME){

          this.prompt.readStartPrompt();

        } else if(data.readingId === PromptType.PROMPT_RESULTS){

          this.prompt.readMessage(data.readingData, data.readingId);

        } else if(data.readingId === PromptType.PROMPT_ERROR){

          //TODO impl./use specialized function?
          this.prompt.readMessage(data.readingData, data.readingId);

        } else {
          isConsumed = false;
          console.error('requested to read unkown prompt: "'+data.readingId+'"');
        }

        // } else if(data.readingId === PromptReader.PROMPT_WELCOME){
        //
        //   this.prompt.readStartPrompt();
        //
        // } else {
        //   isConsumed = false;
        //   console.error('requested to read unkown prompt: "'+data.readingId+'"');
        // }
      }
    }

    if(!isConsumed && !isTest){
      console.error('read: unknown read target ', data);
    }

    return false;
  };

  /**
   * Called when reading should be stopped / aborted.
   *
   * If reading is/was active and is stopped, the "reading-stopped" event must be
   * triggered:
   *
   * <pre>
   * mmir.DialogManager.raise('reading-stopped')
   * </pre>
   *
   * @param  {StopReadingOptions} data the data specifying, which TTS engine should be stopped
   */
  protected stopReading(options: StopReadingOptions): void {
    if(this._debugMsg) console.log('stopReading -> ', options);
    this.vuiCtrl.ttsCancel();
  };

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
    // this.asrCancel();;
    // this.prompt.cancel();
  }
}
