
import { Emma , RecognitionEmma , UnderstandingEmma , TactileEmma, SpeechRecognitionResult , Cmd } from './mmir-base-dialog.d';

export type EmmaFunctionType = 'recognition' | 'understanding';
export type AnyEmma<CmdImpl extends Cmd> = Emma | RecognitionEmma | UnderstandingEmma<CmdImpl> | TactileEmma;
export type RecognitionData = Array<any>;//really: argument-list of recogntion-callback, see ASROnStatus
export type UnderstandingData = {semantic: any, phrase: string, phrases: Array<string>};

export interface EventLike {
  type: 'click' | 'speech' | string;
  [additionalFields: string]: any;
}

export interface EmmaUtil {

  toEmma<CmdImpl extends Cmd>(event: MouseEvent | TouchEvent | Emma | RecognitionEmma | UnderstandingEmma<CmdImpl> | EventLike, data?: any): RecognitionEmma | UnderstandingEmma<CmdImpl> | TactileEmma;
  fire<CmdImpl extends Cmd>(event: MouseEvent | TouchEvent | Emma | RecognitionEmma | UnderstandingEmma<CmdImpl> | EventLike, data?: any): RecognitionEmma | UnderstandingEmma<CmdImpl> | TactileEmma;
  isTactileEvent<CmdImpl extends Cmd>(emmaData: AnyEmma<CmdImpl>) : boolean;
  isSpeechEvent<CmdImpl extends Cmd>(emmaData: AnyEmma<CmdImpl>) : boolean;
  setSpeechRecognition<CmdImpl extends Cmd>(emmaData: AnyEmma<CmdImpl>, event: any, data: RecognitionData): void;
  setSpeechUnderstanding<CmdImpl extends Cmd>(emmaData: AnyEmma<CmdImpl>, event: any, data: UnderstandingData): void;
  addTarget<CmdImpl extends Cmd>(emmaData: AnyEmma<CmdImpl>, target: any, isOverwrite?: boolean): void;
  addProperty<CmdImpl extends Cmd>(emmaData: AnyEmma<CmdImpl>, name: string, value: any, isOverwrite?: boolean): void;
  getTarget<CmdImpl extends Cmd>(emmaData: AnyEmma<CmdImpl>): any;
  getProperty<CmdImpl extends Cmd>(emmaData: AnyEmma<CmdImpl>, name: string): any;
  _setEmmaFuncData<CmdImpl extends Cmd>(emmaEvent: AnyEmma<CmdImpl>, funcName: EmmaFunctionType, funcData: any, isOverwrite?: boolean): void;
  _extractAsrData<CmdImpl extends Cmd>(asrEmmaEvent: AnyEmma<CmdImpl>): SpeechRecognitionResult;
  _extractEmmaFuncData<CmdImpl extends Cmd>(emmaEvent: AnyEmma<CmdImpl>, func: EmmaFunctionType): any;
}
