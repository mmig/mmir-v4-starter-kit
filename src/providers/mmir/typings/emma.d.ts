
import { Emma , RecognitionEmma , UnderstandingEmma , TactileEmma, SpeechRecognitionResult } from './mmir-base-dialog.d';

export type EmmaFunctionType = 'recognition' | 'understanding';
export type AnyEmma = Emma | RecognitionEmma | UnderstandingEmma | TactileEmma;
export type RecognitionData = Array<any>;//really: argument-list of recogntion-callback, see ASROnStatus
export type UnderstandingData = {semantic: any, phrase: string, phrases: Array<string>};

export interface EventLike {
  type: 'click' | 'speech' | string;
  [additionalFields: string]: any;
}

export interface EmmaUtil {

  toEmma(event: MouseEvent | TouchEvent | Emma | RecognitionEmma | UnderstandingEmma | EventLike, data?: any): RecognitionEmma | UnderstandingEmma | TactileEmma;
  fire(event: MouseEvent | TouchEvent | Emma | RecognitionEmma | UnderstandingEmma | EventLike, data?: any): RecognitionEmma | UnderstandingEmma | TactileEmma;
  isTactileEvent(emmaData: AnyEmma) : boolean;
  isSpeechEvent(emmaData: AnyEmma) : boolean;
  setSpeechRecognition(emmaData: AnyEmma, event: any, data: RecognitionData): void;
  setSpeechUnderstanding(emmaData: AnyEmma, event: any, data: UnderstandingData): void;
  addTarget(emmaData: AnyEmma, target: any, isOverwrite?: boolean): void;
  addProperty(emmaData: AnyEmma, name: string, value: any, isOverwrite?: boolean): void;
  getTarget(emmaData: AnyEmma): any;
  getProperty(emmaData: AnyEmma, name: string): any;
  _setEmmaFuncData(emmaEvent: AnyEmma, funcName: EmmaFunctionType, funcData: any, isOverwrite?: boolean): void;
  _extractAsrData(asrEmmaEvent: AnyEmma): SpeechRecognitionResult;
  _extractEmmaFuncData(emmaEvent: AnyEmma, func: EmmaFunctionType): any;
}
