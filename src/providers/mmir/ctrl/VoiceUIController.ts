import { ElementRef, Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MmirProvider } from '../mmir-provider';
import { RecognitionEmma , UnderstandingEmma , ShowSpeechStateOptions, ReadingShowOptions , ReadingOptions , StopReadingOptions, SpeechFeedbackOptions } from '../typings/mmir-base-dialog.d';
import { SPEECH_ACTIVE , READ_ACTIVE } from '../consts';
import { triggerClickFeedback , FeedbackOption } from '../io/HapticFeedback';
import { PromptReader } from '../io/PromptReader';
import { SpeechInputController } from '../ctrl/SpeechInputController';
import { SpeechOutputController } from '../ctrl/SpeechOutputController';
import { SubscriptionUtil } from '../util/SubscriptionUtil';
import { DictationTargetHandler , DictationHandler, DictationTarget , SelectionMode } from '../io/SpeechDictation';
import { ReadTargetHandler , ReadHandler } from '../io/SpeechReading';
import { EventLike } from '../typings/emma.d';
import { ISpeechInputIndicator , ISpeechOutputIndicator } from '../typings/speech-indicator.d';
import { IonicMmirModule , SpeechEventName } from '../typings/mmir-ionic.d';

// import { ReadOverlay } from '../../../components/speech-overlay/dialogs/read-overlay';

export class VoiceUIController<CmdType, CmdParam> {

  protected _mmirProvider: MmirProvider<CmdType, CmdParam>;
  protected mmir: IonicMmirModule<CmdType, CmdParam>;

  protected prompt: PromptReader;
  protected _asrActive: boolean = false;

  public asrActiveChange: BehaviorSubject<boolean>;
  public ttsActiveChange: BehaviorSubject<boolean>;

  /**
   * FLAG for "permanent command mode":
   * if true, speech-input for command mode will stay active on page/view changes
   * @type {boolean}
   */
  public isPermanentCommandMode: boolean = false;

  /**
   * set dictation overlay to singleton (or not):
   * in singleton mode, overlay reference does not get reset upon leaving a view.
   */
  public isDictationOverlaySingleton: boolean;
  /**
   * set read overlay to singleton (or not):
   * in singleton mode, overlay reference does not get reset upon leaving a view.
   */
  public isReadOverlaySingleton: boolean;

  protected _debugMsg: boolean = false;

  protected _defaultDictationFeedbackStyle: SelectionMode;

  public get asrActive(): boolean { return this._asrActive; }
  public get ttsActive(): boolean { return this.prompt? this.prompt.active : false; }

  protected speechOut: SpeechOutputController;
  protected speechIn: SpeechInputController;

  protected activePageSubscriptions: Array<Subscription>;

  protected subsUtil: SubscriptionUtil;
  protected dictTargetHandler: DictationTargetHandler;
  protected readTargetHandler: ReadTargetHandler;

  protected dictationOverlay: ISpeechInputIndicator;
  protected readOverlay: ISpeechOutputIndicator;

  protected readOverlayClickSubscription: Subscription;

  public get debug(): boolean { return this._debugMsg; }
  public set debug(value: boolean) {
    this._debugMsg = value;
    this.speechIn.debug = value;
    this.speechOut.debug = value;
  }

  protected _speechEventSubscriptions: Map<SpeechEventName, Subscription>;

  protected initializing: Promise<MmirProvider<CmdType, CmdParam>>;

  constructor(
    mmirProvider: MmirProvider<CmdType, CmdParam>
  ) {
    this._mmirProvider = mmirProvider;
    this.mmir = this._mmirProvider.mmir;

    this.subsUtil = new SubscriptionUtil(this.mmir);
    this.dictTargetHandler = new DictationTargetHandler();
    this.readTargetHandler = new ReadTargetHandler();

    this.activePageSubscriptions = [];

    this.asrActiveChange = new BehaviorSubject<boolean>(false);
    this.ttsActiveChange = new BehaviorSubject<boolean>(false);

    this._defaultDictationFeedbackStyle = 'interim';//'unstable';//FIXME retrieve from settings?
    this.speechIn = new SpeechInputController(this.subsUtil, mmirProvider, this.dictTargetHandler);
    this.speechOut = new SpeechOutputController(this.subsUtil, mmirProvider);

    this.isDictationOverlaySingleton = false;
    this.isReadOverlaySingleton = false;

    this.initializing = mmirProvider.ready().then(mp => {

      this.prompt = new PromptReader(this.mmir.dialog, this.mmir.media);
      this.prompt.cancelOnNew = true;
      this._speechEventSubscriptions = this.subsUtil.subscribe([
        'showSpeechInputState',
        'changeMicLevels',
        'cancelSpeechIO',
        'stopReading',
        'showReadingStatus'
        //'resetGuidedInputForCurrentControl' , 'startGuidedInput' , 'resetGuidedInput' , 'isDictAutoProceed'
      ], this);

      return mp;
    });
  }

  public ready(): Promise<MmirProvider<CmdType, CmdParam>> {
    return this.initializing;
  }

  public destroy() {

    this.speechIn.destroy();
    this.speechOut.destroy();
    this.releaseUiResources(true);
    this.dictTargetHandler.destroy();
    this.readTargetHandler.destroy();

    this.subsUtil.unsubscribe(this._speechEventSubscriptions);
  }

  public getPromptReader(): PromptReader{
    return this.prompt;
  }

  /**
   * stop speech-input/close microphone
   *
   * @param  {boolean} leaveCommandActive
   *              if true, speech-input will not be canceled, if it is currently
   *              in command mode, or guided-input mode
   *              (i.e. only canceled if in "pure" dictation mode)
   */
  public asrCancel(leaveCommandActive: boolean): void {
    const action = leaveCommandActive? 'cancel-non-guided-dictation' : 'cancel-speech-input';
    this.mmir.dialog.raise(action);
  }

  public ttsCancel(options?: StopReadingOptions): void {
    if(this.prompt){
      this.prompt.cancel(options as any);//FIXME cast necessary, because prompt uses /model/SpeechData::StopReadingOptions ... should use generics to set TTS/ASR option types...
    }
  }

  public enterView(asrActiveHandler: ((asrActive: boolean) => void) | null, ttsActiveHandler: ((ttsActive: boolean) => void) | null) : void {

    //cancel any previous subscriptions:
    this.doUnsubscribeCurrentPage();
    this.dictTargetHandler.reset();
    this.readTargetHandler.reset();

    if(asrActiveHandler){
      this.activePageSubscriptions.push(this.asrActiveChange.subscribe(asrActiveHandler));
    }

    if(ttsActiveHandler){
      this.activePageSubscriptions.push(this.ttsActiveChange.subscribe(ttsActiveHandler));
    }
  }

  /**
   * Remembers the subscription for the current/active view, and
   * unsubscribes when #leaveView is triggered.
   *
   * @param {Subscription} subscription
   */
  public addViewSubscription(subscription: Subscription | Array<Subscription>): void {
    if(Array.isArray(subscription)){
      for(let subs of subscription){
        this.activePageSubscriptions.push(subs);
      }
    } else {
      this.activePageSubscriptions.push(subscription);
    }
  }

  public leaveView() {

    this.doUnsubscribeCurrentPage();
    this.releasePageResources();
    this.dictTargetHandler.reset();
    this.readTargetHandler.reset();

    //stop all voice input/output interactions (i.e. close microphone, stop reading ...)
    //NOTE would need special treatment, if pending ASR results should be stored/used!!!
    this.asrCancel(this.isPermanentCommandMode);
    this.ttsCancel();
  }

  protected doUnsubscribeCurrentPage(){

    const len = this.activePageSubscriptions.length;
    if(len > 0){
      for(let i = 0; i < len; ++i){
        this.activePageSubscriptions[i].unsubscribe();
      }
      this.activePageSubscriptions.splice(0, len);
    }

  }

  protected releasePageResources(){
    this.releaseUiResources(false);
  }

  protected releaseUiResources(force: boolean){

      if(force || !this.isDictationOverlaySingleton){
        this.dictationOverlay = null;
      }

      if(force || !this.isReadOverlaySingleton){
        this.clearReadOverlaySubscription();
        this.readOverlay = null;
      }
  }

  public handleClick(event: MouseEvent | TouchEvent | RecognitionEmma | UnderstandingEmma<CmdType, CmdParam> | EventLike, name: string, data?){

    this.triggerTouchFeedback(event);

		// this.inp.raise('touch_input_event');
		// this.inp.raise('click_on_' + name, data);
    let emmaEvt = this.mmir.dialog._emma.toEmma(event, data);
    this.mmir.dialog._emma._setEmmaFuncData(emmaEvt, 'understanding', {
      name: name,
      data: data
    });
    // this.dlg._emma.addTarget(emmaEvt, name, true);
    // this.dlg._emma.addProperty(emmaEvt, 'data', data, true);
    if(this._debugMsg) console.log(emmaEvt);
    this.mmir.input.raise('touch', emmaEvt);
  }

  public localize(res: string) : string {
    if(this.mmir.lang){
      return this.mmir.lang.getText(res);
    } else {
      //if(this._debugMsg) console.info('mmir.LanguageManager not ready yet...');
      return '';
    }
  }

  public evalSemantics(asr_result: string){//TODO use emma-recognition event as input

    this.mmir.semantic.interpret(asr_result, null, result => {

      var semantic;
      if(result.semantic != null) {
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
      //TODO create emma-understanding event
      this.mmir.input.raise("speech_input_event",  semantic);

    });

  }

  public triggerTouchFeedback(event: MouseEvent | TouchEvent | RecognitionEmma | UnderstandingEmma<CmdType, CmdParam> | EventLike, feedbackOptions?: FeedbackOption){
    triggerClickFeedback(feedbackOptions);
  }

  ////////////////////////////////////////// Speech IO ////////////////////////

  public commandClicked(event: MouseEvent | TouchEvent | RecognitionEmma | UnderstandingEmma<CmdType, CmdParam> | EventLike, btnId: string, feedbackOptions?: FeedbackOption){

    if(event && (event as any).preventDefault){
      (event as any).preventDefault();
    }

    //if(this._debugMsg) console.log('commandClicked');

    if(this.ttsActive){
      this.ttsCancel();
    }

    // if(!isSyntheticClick(event))//TODO detect programatically triggered invocations of this function?
    this.triggerTouchFeedback(event, feedbackOptions);

    this.mmir.dialog.raise('toggleSpeechInputState', {mode: 'command', targetId: btnId});
	  this.mmir.dialog.raise('showSpeechState');
  }

  /**
   *
   * dictationClicked(event: Event, target: DictationTarget, feedbackMode?: SelectionMode)
   *
   * @param  {Event} event
   * @param  {DictationTarget | string} target
   *                          The dication target.
   *                          If called the first time for this target, the argument must be a DictationTarget object
   * @param  {SelectionMode} [feedbackStyle]
   *                          style for visualizing unstable/interim part of dictation result/text
   *                          DEFAULT: uses #_defaultDictationFeedbackStyle
   */
  public dictationClicked(event: Event, targetId: string | DictationTarget, feedbackStyle?: SelectionMode, touchFeedback?: FeedbackOption): void {

    event.preventDefault();

    //if(this._debugMsg) console.log('dictationClicked');

    if(this.ttsActive){
      this.ttsCancel();
    }

    // if(!isSyntheticClick(event))//TODO detect programatically triggered invocations of this function?
    this.triggerTouchFeedback(event, touchFeedback);

    let targetRef: DictationTarget;
    if(typeof targetId !== 'string'){
      targetRef = targetId;
      targetId = targetId.id;
    }

    feedbackStyle = feedbackStyle? feedbackStyle : this._defaultDictationFeedbackStyle;

    let handler: DictationHandler = this.dictTargetHandler.get(targetId);
    if(!handler){
      if(targetRef){
        handler = this.speechIn.createDictationTarget(targetRef, targetId, feedbackStyle);
      } else {
        console.error('dictationClicked: missing DictationTarget, cannot create DiactationHandler for '+targetId);
        //TODO throw error or something?
        return;/////////////// EARLY EXIT /////////////////////
      }
      this.dictTargetHandler.put(targetId, handler);
    }
    handler.prepare();

    this.mmir.dialog.raise('toggleSpeechInputState', {mode: 'dictation', targetId: targetId});
	  this.mmir.dialog.raise('showSpeechState');
  }

  private updateCurrentDictationTarget(targetId: string, active: boolean){
    this.dictTargetHandler.apply(handler => {
      if(active && handler.id === targetId){
        handler.nativeInput.classList.add(SPEECH_ACTIVE);
        handler.nativeCtrl.classList.add(SPEECH_ACTIVE);
      } else {
        handler.nativeInput.classList.remove(SPEECH_ACTIVE);
        handler.nativeCtrl.classList.remove(SPEECH_ACTIVE);
      }
      handler.showDictationFeedback(active);
    });
  }

  /**
   * Set the overlay for GUI feedback during dictation (speech input).
   *
   * @param  {ISpeechInputIndicator} speechOverlay
   *                         the overlay reference
   * @param  {boolean} [asSingleton] OPTIONAL
   *                        if the overlay should be used as singleton (i.e. reuse
   *                        this instance between views):
   *                        if specified, sets {@link #isDictationOverlaySingleton}
   */
  public setDictationOverlay(speechOverlay: ISpeechInputIndicator, asSingleton?: boolean): void {
    if(typeof asSingleton === 'boolean'){
      this.isDictationOverlaySingleton = asSingleton;
    }
    this.dictationOverlay = speechOverlay;
    this.updateDictationOverlayToCurrentState();
  }

  private updateDictationOverlayToCurrentState(){
      const subj = this._mmirProvider.mmir.dialog._eventEmitter.showSpeechInputState as any;
      if(subj && subj.source && subj.source.value){
        this.updateDictationOverlay(subj.source.value);
      }
  }

  private updateDictationOverlay(state: ShowSpeechStateOptions){

    this.updateCurrentDictationTarget(state.targetId, state.state);

    if(!this.dictationOverlay || state.mode !== 'dictation'){
      return;
    }

    let handler: DictationHandler = this.dictTargetHandler.get(state.targetId);
    if(!handler){
      console.log('ERROR: no dictation handler for dicatation target '+state.targetId);
      if(!state.state){
        this.setSpeechOverlay(null, this.dictationOverlay, false);
      }
    } else {
      this.setSpeechOverlay(handler.activationCtrl, this.dictationOverlay, state.state);
    }
  }

  private setSpeechOverlay(target: HTMLElement, speechOverlay: ISpeechInputIndicator, active?: boolean){

    if(speechOverlay){

      //is active was not defined, use current ASR status
      active = typeof active === 'undefined'? this._asrActive : active;

      //may get called before overlay-component has initialized:
      if(speechOverlay.initialized){

        if(active){
          speechOverlay.show({}, target);
        } else {
          speechOverlay.hide();
        }

      } else {
        //-> not yet initialized, so wait...

        //set state/target for when overlay is ready:
        speechOverlay.ready({show: active, target: target});
      }
    }

  }

  /**
   *
   * ttsClicked(event: Event, targetId?: string | ElementRef | HTMLElement)
   * ttsClicked(targetId: string | ElementRef | HTMLElement)
   *
   * @param  {Event} [event]
   * @param  {string | ElementRef | HTMLElement} [target]
   *                          The reading "target"/control widget (if omitted, the target of the event will be used)
   */
  public ttsClicked(event?: Event | string | ElementRef | HTMLElement, targetId?: string | ElementRef | HTMLElement, feedbackOptions?: FeedbackOption): void {

    if(event && (event as any).preventDefault){
      (event as any).preventDefault();
      this.triggerTouchFeedback(event as any, feedbackOptions);
    }

    if(!event || !(event as Event).target) {
      targetId = event as any;
      event = null;
    }

    let target = this.readTargetHandler.tryGetAndPut(targetId, event as Event);
    if(target){

      this.readTargetHandler.activeHandler = target;

      const ctrl = target.ctrl;
      if(this.readOverlay){
        // this.readOverlay.target = ctrl;
        this.readOverlay.startReading(event, ctrl);
      }
    }

  }

  /**
   * Set the GUI overlay feedback for active reading
   *
   * @param  {ISpeechOutputIndicator} readOverlay
   *                         the overlay reference
   * @param  {boolean} [asSingleton] OPTIONAL
   *                        if the overlay should be used as singleton (i.e. reuse
   *                        this instance between views):
   *                        if specified, sets {@link #isReadOverlaySingleton}
   */
  public setReadOverlay(readOverlay: ISpeechOutputIndicator, asSingleton?: boolean): void {
    if(typeof asSingleton === 'boolean'){
      this.isReadOverlaySingleton = asSingleton;
    }
    this.initReadOverlayInstance(readOverlay);
    this.updateReadOverlayToCurrentState();
  }

  private initReadOverlayInstance(readOverlay: ISpeechOutputIndicator): void {

    this.clearReadOverlaySubscription();

    this.readOverlay = readOverlay;

    //FIXME re-integrate read-overlay
    // if((readOverlay as ReadOverlay).onClicked){
    //   //add cancel-tts on-click functionality for read-overlay:
    //   this.readOverlayClickSubscription = (readOverlay as ReadOverlay).onClicked.subscribe(event => {
    //     this.triggerTouchFeedback(event);
    //     this.ttsCancel();
    //   });
    // }

  }

  private clearReadOverlaySubscription(): void {
    if(this.readOverlayClickSubscription && !this.readOverlayClickSubscription.closed){
      this.readOverlayClickSubscription.unsubscribe();
    }
    this.readOverlayClickSubscription = null;
  }

  private updateReadOverlayToCurrentState(){
      const subj = this._mmirProvider.mmir.dialog._eventEmitter.showReadingStatus as any;
      if(subj && subj.source && subj.source.value){
        this.updateReadOverlay(subj.source.value, this.readTargetHandler.activeHandler);
      }
  }

  private updateReadOverlay(state: ReadingShowOptions, targetId?: string | ReadHandler){

    let active: boolean = state.active;
    if(!active && (state as StopReadingOptions).continuesReading){
      //if there is a next prompt/read-text immediately following the inactive state, do not actually set to inactive (but leave active)
      active = true;
    }

    this.updateCurrentReadTarget(targetId, active);

    if(!this.readOverlay){
      return;
    }

    let target: HTMLElement;
    let handler: ReadHandler = typeof targetId === 'string'? this.readTargetHandler.get(targetId) : targetId;
    if(handler){
      target = handler.ctrl;
    }
    this.doSetReadOverlay(target, this.readOverlay, active);
  }

  private doSetReadOverlay(target: HTMLElement, readOverlay: ISpeechOutputIndicator, active: boolean){

    if(readOverlay){

      //is active was not defined, use current ASR status
      active = typeof active === 'undefined'? this.ttsActive : active;
      active = target? active: false;

      //may get called before overlay-component has initialized:
      if(readOverlay.initialized){

        if(active){
          readOverlay.startReading({}, target);
        } else {
          readOverlay.stopReading();
        }

      } else {
        //-> not yet initialized, so wait...

        //set state/target for when overlay is ready:
        readOverlay.ready({show: active, target: target});
      }
    }

  }

  private updateCurrentReadTarget(targetId: string | ReadHandler, active: boolean){
    targetId = targetId && typeof targetId !== 'string'? targetId.id : targetId;
    this.readTargetHandler.apply(handler => {
      if(active && handler.id === targetId){
        handler.ctrl.classList.add(READ_ACTIVE);
      } else {
        handler.ctrl.classList.remove(READ_ACTIVE);
      }
    });
  }


  // public ttsClicked(event){
  //
  //   event.preventDefault();
  //
  //   if(this.asrActive){
  //     this.asrCancel(false);
  //   }
  //
  //   //FIXM
  //   // if(this.ttsActive){
  //   //   this.ttsCancel();
  //   // }
  //   // else {
  //   //   this.read(defaultPrompt);
  //   // }
  // }


  protected showSpeechInputState(options: ShowSpeechStateOptions): void {
    if(this._debugMsg) console.log('showSpeechInputState -> ', options);
    this._asrActive = options.state;
    this.updateDictationOverlay(options);
    this.asrActiveChange.next(this._asrActive);
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
  protected changeMicLevels(options: SpeechFeedbackOptions): void {
    if(this._debugMsg) console.log('changeMicLevels -> ', options);
  };

  ////////////////////////////////////////// Speech Output Event Handlers ///////////////////////

  protected showReadingStatus(options: ReadingShowOptions): void {
    if(this._debugMsg) console.log('showReadingStatus -> ', options);

    this.prompt.setActive(options.active);
    this.updateReadOverlay(options, this.readTargetHandler.activeHandler);

    this.ttsActiveChange.next(this.prompt.active);
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
    //NOTE raising 'reading-stopped' etc. is handled in prompt.cancel()
    this.ttsCancel(options);
  };


  /**
   * Called when speech input (ASR; recogintion) AND speech output (TTS; synthesis)
   * should be stopped.
   */
  public cancelSpeechIO(): void {
    if(this._debugMsg) console.log('cancelSpeechIO -> ()');
    this.ttsCancel();
    this.asrCancel(this.isPermanentCommandMode);
  };

}
