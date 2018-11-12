import { ElementRef, ChangeDetectorRef } from '@angular/core'

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MmirProvider, IonicDialogManager, IonicMmirModule } from '../mmir-provider';
import { RecognitionEmma , UnderstandingEmma , ShowSpeechStateOptions , RecognitionType , SpeechRecognitionResult } from '../typings/mmir-base-dialog.d';// 'mmir-base-dialog';
import { EmmaUtil } from '../typings/emma.d';// 'mmir-emma';

import { SpeechEventSubscription } from '../io/ISpeechIO';
import { SubscriptionUtil } from '../util/SubscriptionUtil';
import { DictationTargetHandler , DictationHandler , DictationTarget , CurrentInputData , UNSTABLE_RESULT_HTML_PREFIX , UNSTABLE_RESULT_HTML_SUFFIX , SelectionMode } from '../io/SpeechDictation';
import { triggerClickFeedback } from '../io/HapticFeedback';
import { SelectionUtil } from '../util/SelectionUtil';

export type RecognitionTypeExt = RecognitionType | 'RECOGNITION_ERROR';

export interface ASRResult extends SpeechRecognitionResult {
  isAutoComplete?: boolean;
}

export interface DisplayText {
  text: string;
  rest?: string;
  interimIndex?: number;
  unstable?: string;
  isAutoComplete?: boolean;
}

export class SpeechInputController {

  protected _debugMsg: boolean = false;

  public dictationResults: Observable<RecognitionEmma>;//TODO remove?

  protected _speechEventSubscriptions: SpeechEventSubscription = {
      'showDictationResult': null,
      'determineSpeechCmd': null,
      'execSpeechCmd': null
      //'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed'
  };

  protected _emma: EmmaUtil;
  protected _mmir: IonicMmirModule;

  protected _selectionUtil: SelectionUtil;

  protected _stopDictWord: string;
  /**stop-expression for stopping dictation-input*/
  protected _stopDictExpr: RegExp;
  protected _cancelDictWord: string;
  protected _cancelDictExpr: RegExp;

  public get debug(): boolean { return this._debugMsg; }
  public set debug(value: boolean) {
    this._debugMsg = value;
    this.dictTargetHandler.apply(handler => handler.debug = value);
  }

  constructor(
    protected subsUtil: SubscriptionUtil,
    protected mmirProvider: MmirProvider,
    protected dictTargetHandler: DictationTargetHandler
  ) {

    mmirProvider.ready().then(mmirp => {
      this._mmir = mmirp.mmir;
      this._emma = mmirp.mmir.dialog._emma;
      this.subsUtil.subscribe(this._speechEventSubscriptions, this);
      this.dictationResults = mmirp.mmir.dialog._eventEmitter.showDictationResult.map(dictation => this._processDictationResult(dictation));

      //FIXME should get configuration from somewhere else?
      const stopWord = this._mmir.conf.get('app.dictStopWord', 'anhalten');
    	if(stopWord){
    	  const cancelWord: string = this._mmir.conf.get('app.dictAbortWord', '');
    		this.setDictationCommand(stopWord, cancelWord);
    	}

      this._mmir.require(['lengthUtil', 'caretPosition'], (len, pos) =>  {
        this._selectionUtil = new SelectionUtil(len, pos);

        //TODO move this, since it's application specific...
        //style faux-span: must force some global-styling for SPAN to use the selection's own style
        //                 -> set ID for faux SPAN and specify style for "reseting" global styling
        const opt = this._selectionUtil.getSelectionOptions();
        opt.fauxId = 'sel-marker-faux';

        const fauxStyle = document.createElement('style');
    		fauxStyle.textContent = '#sel-marker-faux {font-size:inherit;text-align:inherit;}';
        document.head.appendChild(fauxStyle);
      });
    });
  }

  public destroy() {
    this.subsUtil.unsubscribe(this._speechEventSubscriptions);
  }

  //DISABLED would need change-detection, in case textfield is edited manually!!!
  // public createDictationHandler(textfield: ElementRef, id: string, feedbackStyle?: SelectionMode|boolean, isHandleStandalone?: boolean): DictationHandler {
  //
  //   if(typeof feedbackStyle === 'boolean'){
  //     isHandleStandalone = feedbackStyle;
  //     feedbackStyle = void(0);
  //   }
  //
  //   const handler = new DictationHandler(id, this._emma, this, this._selectionUtil);
  //
  //   if(feedbackStyle){
  //     handler.selectionMode = feedbackStyle as SelectionMode;
  //   }
  //
  //   if(isHandleStandalone){
  //     handler.init(textfield);
  //   } else {
  //     handler.setTarget(textfield);
  //   }
  //
  //   return handler;
  // }

  public createDictationTarget(target: DictationTarget, id: string, feedbackStyle?: SelectionMode): DictationHandler {

    const handler = new DictationHandler(id, this._emma, this, this._selectionUtil);
    handler.debug = this._debugMsg;

    if(feedbackStyle){
      handler.selectionMode = feedbackStyle;
    }

    handler.setTargetRef(target);

    return handler;
  }

  public setDictationCommand(stopCommandWord: string, cancelCommandWord?: string){
    this._stopDictWord = stopCommandWord || '';
    this._cancelDictWord = cancelCommandWord || '';
    this.doUpdateDictationCmd();
  }

  protected doUpdateDictationCmd(){
    let stopWord: string = this._stopDictWord;
    const cancelStopWord = this._cancelDictWord;
    if(cancelStopWord){
      stopWord = '(' + stopWord + '|' + cancelStopWord + ')';
    }
    this._cancelDictExpr = new RegExp('\\b'+cancelStopWord+'\\s*$', 'i');
    //stop-expression for stopping dictation-input
    this._stopDictExpr = new RegExp('\\b'+stopWord+'\\s*$', 'i');
  }

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

    let targetId = this._emma.getTarget(asrEmmaEvent);
    let target = this.dictTargetHandler.get(targetId);
    if(target){

      asrEmmaEvent = this._processDictationResult(asrEmmaEvent);

      // target.handleDictationResult(asrEmmaEvent);

      this.doHandleDictationResult(asrEmmaEvent, target);

    } else {
      console.warn('no dictation target initilized for "'+targetId+'"');
    }
  }


  protected _processDictationResult(asrEmmaEvent: RecognitionEmma): RecognitionEmma {//TODO remove?
    if(this._debugMsg) console.log('_processDictationResult -> ', asrEmmaEvent);
    return asrEmmaEvent;
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
    if(this._debugMsg) console.log('determineSpeechCmd -> ', asrEmmaEvent);
    // let cmd = ;
    // this.inp.raise('speech', cmd);
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
  }

  protected doHandleDictationResult(asrEmmaEvent: RecognitionEmma, inputElem: DictationHandler){

  	const asr = this._emma._extractAsrData(asrEmmaEvent) as ASRResult;
  	// var targetId = this._extractTargetElementId(asrEmmaEvent);

  	const currentInputData: CurrentInputData = inputElem._inputData;// this._getCurrentInput(targetId);
  	// const inputElem = this._getCurrentInputElement(targetId);

  	let result: string = asr.text;
  	const	score: number = asr.confidence,
  		type: RecognitionTypeExt = asr.type as RecognitionTypeExt,
  //		alternatives = asr.alternatives,
  		unstable: string = asr.unstable,
  		isAutoComplete: boolean = asr.isAutoComplete;//<- flag: if omitted or TRUE: do "commit" result to autocomplete (if the targeted DOM-element is an autocomplete widget)

  	let isStopped: boolean = false;

  	//process non-guided "selection mode" for autocomplete
  	const isGuided: boolean = false;//TODO: asrEmmaEvent && asrEmmaEvent.interpretation && asrEmmaEvent.interpretation.isGuided;
  	let isConsumed: boolean = false;
  	if(! isGuided){

      //TODO: impl.:  autocomplete-widget handling
  // 		if(inputElem && inputElem.isAutocomplete()){//} && inputElem.input.attr('disamb') == 'true'){
  //
  // 			var foundOptions = inputElem.getAutocompleteMenu();
  //
  // 			// mmir.DialogManager.performHelper('WikSite', 'setHelpHint', null, {enable: true, mode: 'dictation', 'helpHint': {
  // 			// 	'text': 'Zum Auswählen, nennen Sie bitte einen Eintrag.',
  // 			// 	'cmd': ''
  // 			// }});
  // 			// this.repositionSpeechDictDlg();
  //
  //
  // 			if(type == 'INTERIM'){
  // 				if(foundOptions.length > 0){
  // 	//				isAutoComplete = false;
  // 					return;//do not apply interim-results when there is already one result displayed
  // 				}
  // 			} else {
  //
  // 	//			inputElem.input.attr('disamb', 'false');
  //
  // 				var isReset = false;
  // 	//			var foundOptions = inputElem.getAutocompleteMenu();
  // 				if(foundOptions.length < 1){
  // 	//				isReset = true;
  // 					if(currentInputData.result.length > 0){
  // 						isReset = true;
  // 					}
  // 				} else {
  //
  // 					var options = wik.tools.createAutoCompleteChooseCommand(foundOptions);
  // 					if(options && !$.isArray(options)){
  // 						options = [options];
  // 					}
  // 					var textTriple = wik.tools.getAsTriple(result);
  // 					var optionText, optionTriple, max;
  // 					if(options.length > 0){
  //
  // 						for(var i=0, size = options.length; i < size; ++i){
  //
  // 							optionText = options[i].param.title;
  // 							optionTriple = wik.tools.getAsTriple(optionText);
  // 							score = wik.tools.calculate(optionTriple, textTriple);
  //
  // 							if(!max || (score > 0 && score > max.score)){
  // 								max = {
  // 									score: score,
  // 									//TODO calc coverage & require min. converage for exec max cmd
  // 									index: i
  // 								};
  // 							}
  // 						}
  //
  // 					}
  //
  // 					if(max && max.score > 0){//TODO use more strict limit? or coverage with some limit?
  //
  // 						inputElem.setSysSel(true);
  // 	//					$(options[max.index]).trigger('click');
  //
  // 						this.execCmd(options[max.index], result);
  // 						//since execCmd is async: need to clear sys-sel in one-time select-handler for autocomplet ctrl:
  // 						inputElem.input.one('autocompleteselect', function(event){
  // 							inputElem.setSysSel(false);
  // 						});
  //
  // 						isStopped = true;
  // 						isConsumed = true;
  //
  // 					} else {
  // 						isReset = true;
  // 					}
  //
  // 				}
  //
  // 				var isNoResult = inputElem.isAutocompleteNoResult();
  // 				if(isReset || isNoResult){
  //
  // 					//reset by removing previous results/text and setting the current one as UNSTABLE (and treating input as INTERIM):
  // 					currentInputData.reset();
  // 					unstable = result;
  // 					result = '';
  // 					type = 'INTERIM';
  //
  // //					this.resetDictText(targetId);
  // 					if(!isNoResult){
  // 						inputElem.input.autocomplete('close');
  // 					}
  //
  // //					isConsumed = true;
  // 				}
  //
  // 			}//END if(type == 'INTERIM'){}else{}
  //
  // 		}//END: if(isAutocomplete)

  	}//END: if(!isGuided)

  	let isCanceled: boolean = false;
  	if(!isStopped && type !== 'INTERIM'){

  		const isEvalStopWord: boolean = this._isEvalDictStopWord(asrEmmaEvent);
  		if(isEvalStopWord && this._stopDictExpr.test(result)){

  			if(this._cancelDictExpr.test(result)){
  				isCanceled = true;
  			}

  			result = result.replace(this._stopDictExpr, '');

        //remove trainling whithespace, if there is one:
        if(/\s$/.test(result)){
          result = result.substring(0, result.length - 1);
        }

  			isStopped = true;

  			//isStopped due to stop-word, but already consumed:
  			// need to update input-text -> "un-consume"!
  			if(isConsumed){
  				isConsumed = false;
  			}
  		}

  	}

  	let isUpdateControl: boolean = false;
  	if(!isConsumed){

  		if(type == 'INTERIM'){
  			currentInputData.interim = result;
  			currentInputData.unstable = unstable;
  		}
  		else if(result || isStopped) {

  			currentInputData.interim = '';
  			currentInputData.unstable = '';
  	//		currentInputData.result.push(result.replace(/  /gm, ' '));
  			if(result){
  				currentInputData.add(result);
  			}

  	//		currentInputData.score.push(score);
  	//		currentInputData.result.alternatives.push(alternatives);
  		}

  		if(type !== 'RECOGNITION_ERROR'){

  			//FIXME only should do this when neccessary (-> "focus fix for selecting text on Android": do blur() if non-stable results are contained, so that text-input loses focus)
  			isUpdateControl = isUpdateControl || type !== 'INTERIM';

  			this._printCurrentInput(inputElem.id, isAutoComplete, inputElem);//TODO currentInputData);
  		}
  	}

  	if(isStopped){

  		if(isCanceled || !inputElem.getText().trim()){

  			//input-text is empty due to stop-word-removal, or dict was canceled
  			// -> restore original-text (if there is one)

  			const originalText: string = inputElem.getData('original-text');
  			if(originalText){
  				currentInputData.set(originalText);
  				inputElem.setText(originalText);
  			}
  		}

  		let isActivateCommandInput: boolean = false;

  //		if(inputElem && inputElem.isAutocomplete()){
  //
  //			var foundOptions = inputElem.getAutocompleteMenu();
  //
  //			if(foundOptions.length === 1){
  //
  //				//-> found unique match -> select this
  //				triggerClickFeedback();
  //				mmir.DialogManager.perform('SpeechInput','execCmd', wik.tools.createAutoCompleteChooseCommand(foundOptions));
  //
  //			} else if(foundOptions.length > 1){
  //
  //				//-> trigger disambiguation for entries (interpreted as options)
  //				isActivateCommandInput = true;
  //				mmir.DialogEngine.raise('nonUniqueCmd', wik.tools.createAutoCompleteChooseCommand(foundOptions));
  //
  //////				inputElem._autocompleteDisamb = true;
  ////				inputElem.input.attr('disamb', 'true');
  //			}
  //		}

        //TODO impl. auto-proceed, i.e. go-to-next
  		// if(this.isDictAutoProceed()){
  // 			var dicts = $('.wik-speech.speech-dict');
  // 			var currIndex = -1;
  // 			var size = dicts.length;
  // 			if(size > 1){
  // 				for(var i=0; i < size; ++i){
  // 					if(dicts[i].id == targetId){
  // 						currIndex = i;
  // 						break;
  // 					}
  // 				}
  // 			}
  // 			if(currIndex > -1 && currIndex + 1 < size){
  // 				$(dicts[currIndex+1]).trigger('click');
  // 			}
  // 			else {
  // //				$('#mc-speech-command').trigger('click');
  // 				isActivateCommandInput = true;
  // 			}
  // 		}
  // 		else {

  			if(inputElem.getData('speech') === 'restart-command'){
  				inputElem.removeData('speech');//reset element
  //				$('#mc-speech-command').trigger('click');//restart command-mode
  				isActivateCommandInput = true;
  			}
  			else if(!isActivateCommandInput) {
  				//close dictation
          this._mmir.dialog.raise('cancel-dictation');
  				isUpdateControl = true;
  			}
  		// }//END: if(this.isDictAutoProceed()){...

  		if(isActivateCommandInput){
  			triggerClickFeedback();//FIXME should we use impl. from VoiceUIController here instead?
  			this._mmir.dialog.raise('toggleSpeechInputState', {mode: 'command', targetId: 'mc-speech-command'});
  			this._mmir.dialog.raise('showSpeechState');
  			isUpdateControl = true;
  		}

  //		if(isUpdateControl){
  //			inputElem.doSetUnfocused();
  //		}

  	}//END: if(isStopped)

  	//FIXME must/should this be done for asr-engines with interim-results (i.e. Google ASR), so that on Android tablets focus is freed after selection (would only be needed, if unstable was present!)
  	if(isUpdateControl){// !isUpdateControl && unstable){
  		inputElem.doSetUnfocused();
  	}
  }

  protected _printCurrentInput(targetId: string, isCommitAutoComplete: boolean, inputElem: DictationHandler){

  	inputElem = inputElem || this.dictTargetHandler.get(targetId);

  	const output = this._getCurrentInputText(targetId, inputElem.isPlainText, inputElem.isIntegerInput, true, inputElem._inputData);

  	if(output){

  		if(typeof output === 'object'){
  			output.isAutoComplete = isCommitAutoComplete;
  			isCommitAutoComplete = void(0);
  		}

  		inputElem.setText(output, isCommitAutoComplete);
  	}
  }


/**
 * get the text (String) of current input (i.e. everything that was inserted
 * by text or speech up to now).
 *
 *
 * @param {String} targetId
 * 				the ID of the dictation button (without the leading #}
 *
 * @param {Boolean} [isPlainText] OPTIONAL
 * 				if <code>true</code> the returns the current-input-text
 * 				as plain text String.
 * 				If <code>falsy</code> or omitted, returns the current-input-text
 * 				as HTML formatted String (i.e. with HTML tags) which are:
 *  			  <ul>
 *  				<li>for <em>unstable</em> part: if present, unstable text will be
 *  					wrapped in a SPAN tag with <code>class</code> "unstable".
 *  				</li>
 *  			  </ul>
 *
 *
 *  @param {Boolean} [isRemoveAllWhitespaces] OPTIONAL
 *  			IFF true, all whitespaces are removed from the returned (stable part of the) output text
 *
 *  @param {Boolean} [isWithExtraUnstable] OPTIONAL
 *  			if this argument is used, then isPlainText MUST be given too.
 *  			If FALSE and the current data-input for <code>targetId</code> contains
 *  			unstable text, then this unstable part is simply appended to the returned text
 *  			(and the <code>unstable</code> field in the retruned object will be empty).
 *  			Otherwise, the unstable part (if present in the current data-input for <code>targetId</code>)
 *  			will be set as <code>unstable</code> field in the retruned object.
 *
 *  @param {CurrentInputData} [inputData] OPTIONAL
 *  			if omitted, the corresponding CurrentInputData for targetId will be used
 *
 *
 *  @returns {String|Object} the current input text as String or an Object {text: String, unstable: String}
 */
protected _getCurrentInputText(targetId: string, isPlainText: boolean, isRemoveAllWhitespaces: boolean, isWithExtraUnstable: boolean, inputData?: CurrentInputData): DisplayText | string {

	let output: string;
  let rest: string;
	let unstable: string;
  let interimIndex: number;
	let currentInputData: CurrentInputData = inputData || this.dictTargetHandler.get(targetId)._inputData;
	if(isPlainText){

		output = currentInputData.getCurrentText();
    rest = currentInputData.getRestText();

		if(isRemoveAllWhitespaces === true){
			output = output.replace(/\s+/gm, '');
		}

		if(currentInputData.interim){
      interimIndex = output.length;
			output = output + ' ' + currentInputData.interim;
		}

		if(currentInputData.unstable){

			if(!isWithExtraUnstable){
				output = output + ' ' + currentInputData.unstable;
			}
			else {
				unstable = currentInputData.unstable;
			}
		}



		output = output.replace(/  /gm, ' ');
	}
	else {

  		output = currentInputData.getCurrentText();
      rest = currentInputData.getRestText();

  		if(currentInputData.interim){
        interimIndex = output.length;
  			if( ! /\s$/igm.test(output)){
  				output += ' ';
  			}
  			output += currentInputData.interim;
  		}

  		// if(output){
  		//
  		// 	//TODO russa: do this on adding the results to the inputData object (and not *every* time when it is printed!)
  		// 	output = output.
  		// 		//remove space before puntuation:
  		// 		replace(/ ([.,;?!:])/igm, '$1').
  		// 		//force upper case on new line and after "sentence ending punctuation"
  		// 		replace(/(^|[.?!]\s)\s?(\w)(\w+)/igm, function(m, p1, w1, w2){ return p1 + w1.toUpperCase() + w2; });
  		//
  		// }

  		if(currentInputData.unstable){

  			if(!isWithExtraUnstable){

  				if( ! /\s$/igm.test(output)){
  					output += ' ';
  				}
  				output += UNSTABLE_RESULT_HTML_PREFIX + currentInputData.unstable + UNSTABLE_RESULT_HTML_SUFFIX;

  			} else {
  				unstable = currentInputData.unstable;
  			}
  		}
  		output = output.replace(/\r?\n/gm, '<br>');
  	}

  	if(isWithExtraUnstable){
  		return {
  			text: output,
        rest: rest,
        interimIndex: interimIndex,
  			unstable: unstable
  		};
  	}
  	else {
  		return output + (rest? ' ' + rest : rest);
  	}
  }

  protected _isEvalDictStopWord(asrEmmaEvent: RecognitionEmma): boolean {
  	//TODO impl. & "global" setting on SpeechInput, in case emmaEvent has no info set? -> this.isEvalDictStopWord
  	return !(asrEmmaEvent && asrEmmaEvent.interpretation && asrEmmaEvent.interpretation.inputMode === 'guided');
  }

  protected isDictAutoProceed(): boolean {
  	return false;//TODO (move to more appropriate place?): mmir.User.isDictAutoProceed();
  };

}
