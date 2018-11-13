
import { Emma , RecognitionEmma , UnderstandingEmma , TactileEmma, SpeechRecognitionResult } from './mmir-base-dialog.d';

export type EmmaFunctionType = 'recognition' | 'understanding';
export type AnyEmma<CmdType, CmdParam> = Emma | RecognitionEmma | UnderstandingEmma<CmdType, CmdParam> | TactileEmma;
export type RecognitionData = Array<any>;//really: argument-list of recogntion-callback, see ASROnStatus
export type UnderstandingData = {semantic: any, phrase: string, phrases: Array<string>};

export interface EventLike {
  type: 'click' | 'speech' | string;
  [additionalFields: string]: any;
}

export interface EmmaUtil {

  toEmma<CmdType, CmdParam>(event: MouseEvent | TouchEvent | Emma | RecognitionEmma | UnderstandingEmma<CmdType, CmdParam> | EventLike, data?: any): RecognitionEmma | UnderstandingEmma<CmdType, CmdParam> | TactileEmma;
  fire<CmdType, CmdParam>(event: MouseEvent | TouchEvent | Emma | RecognitionEmma | UnderstandingEmma<CmdType, CmdParam> | EventLike, data?: any): RecognitionEmma | UnderstandingEmma<CmdType, CmdParam> | TactileEmma;
  isTactileEvent<CmdType, CmdParam>(emmaData: AnyEmma<CmdType, CmdParam>) : boolean;
  isSpeechEvent<CmdType, CmdParam>(emmaData: AnyEmma<CmdType, CmdParam>) : boolean;
  setSpeechRecognition<CmdType, CmdParam>(emmaData: AnyEmma<CmdType, CmdParam>, event: any, data: RecognitionData): void;
  setSpeechUnderstanding<CmdType, CmdParam>(emmaData: AnyEmma<CmdType, CmdParam>, event: any, data: UnderstandingData): void;
  addTarget<CmdType, CmdParam>(emmaData: AnyEmma<CmdType, CmdParam>, target: any, isOverwrite?: boolean): void;
  addProperty<CmdType, CmdParam>(emmaData: AnyEmma<CmdType, CmdParam>, name: string, value: any, isOverwrite?: boolean): void;
  getTarget<CmdType, CmdParam>(emmaData: AnyEmma<CmdType, CmdParam>): any;
  getProperty<CmdType, CmdParam>(emmaData: AnyEmma<CmdType, CmdParam>, name: string): any;
  _setEmmaFuncData<CmdType, CmdParam>(emmaEvent: AnyEmma<CmdType, CmdParam>, funcName: EmmaFunctionType, funcData: any, isOverwrite?: boolean): void;
  _extractAsrData<CmdType, CmdParam>(asrEmmaEvent: AnyEmma<CmdType, CmdParam>): SpeechRecognitionResult;
  _extractEmmaFuncData<CmdType, CmdParam>(emmaEvent: AnyEmma<CmdType, CmdParam>, func: EmmaFunctionType): any;
}
