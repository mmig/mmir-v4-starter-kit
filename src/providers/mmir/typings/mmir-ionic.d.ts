
import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { ShowSpeechStateOptions , SpeechFeedbackOptions , RecognitionEmma , UnderstandingEmma , ReadingOptions , StopReadingOptions , ReadingShowOptions } from './mmir-base-dialog.d';
import { EmmaUtil } from './emma.d';


import { IAudio , PresentationManager , View , ControllerManager , DialogManager , DialogEngine , Controller , MmirModule } from '../../../assets/mmirf/mmir.d';



export interface WaitReadyOptions {
  state: 'wait' | 'ready';
  module: string;
}

export type SpeechEventName = 'showSpeechInputState' |                         //ISpeechState
                        'changeMicLevels' | 'waitReadyState' |          //ISpeechFeedback
                        'showDictationResult' |                         //ISpeechDictate
                        'determineSpeechCmd' | 'execSpeechCmd' |        //ISpeechCommand
                        'cancelSpeechIO' |                              //ISpeechInputProcessor
                        'read' | 'stopReading' | 'showReadingStatus' |  //ISpeechOutput
                        'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed' //IGuidedSpeechInput
                        ;
export interface SpeechEventEmitter<CmdType, CmdParam> {
    showSpeechInputState: BehaviorSubject<ShowSpeechStateOptions>;
    changeMicLevels: BehaviorSubject<SpeechFeedbackOptions>;
    waitReadyState: BehaviorSubject<WaitReadyOptions>;
    showDictationResult: Subject<RecognitionEmma>;
    determineSpeechCmd: Subject<RecognitionEmma>;
    execSpeechCmd: Subject<UnderstandingEmma<CmdType, CmdParam>>;
    cancelSpeechIO: Subject<void>;
    read: Subject<string|ReadingOptions>;
    stopReading: Subject<StopReadingOptions>;
    showReadingStatus: BehaviorSubject<ReadingShowOptions>;
    //'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed'
    playError: Subject<PlayError>;
}

export interface PlayError {
  audio: IAudio | HTMLAudioElement;
  error: DOMException;
}

export interface IonicPresentationManager extends PresentationManager {
  _ionicNavCtrl: Nav;
  addView: (ctrlName: string, view: View|IonicView) => void;
  _getIonicViewController: (ctrl: IonicController) => Component;
}

export interface IonicControllerManager extends ControllerManager {
  get: (ctrlName: string) => IonicController;
  _createIonicController: (ctrlName: string, viewName?: string, ionicViewCtrl?: any) => IonicController;
}

export interface IonicDialogManager<CmdType, CmdParam> extends DialogManager {
  _perform;
  _raise;
  _emma: EmmaUtil;
  _eventEmitter: SpeechEventEmitter<CmdType, CmdParam>;
  _isDebugVui: boolean;
}

export interface IonicDialogEngine extends DialogEngine {
  worker;
}

export type Action = {name: string, data: any};
export interface IonicController extends Controller {
  _eventEmitter: Subject<Action>;
  _ionicViews: {[id:string]: IonicView};
  addView: (viewName:string, ionicView: any) => void;
}

export interface IonicMmirModule<CmdType, CmdParam> extends MmirModule {
  ctrl: IonicControllerManager;
  dialog: IonicDialogManager<CmdType, CmdParam>
  dialogEngine: IonicDialogEngine;
  present: IonicPresentationManager;
}

export type ViewDecl = {name: string, ctrlName: string, view: any};
export type IonicView = {_name: string, getName: () => string, view: Component, ctrl?: IonicController};
