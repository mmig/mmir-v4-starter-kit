
import { MmirProvider } from './mmir-provider';
import { VoiceUIProvider } from './voice-ui-provider';
import { IonicDialogManager , IonicMmirModule , IPromptHandler } from './typings/mmir-ionic.d';
import { ReadingOptions , StopReadingOptions , ReadingShowOptions , SpeechFeedbackOptions , RecognitionEmma , UnderstandingEmma , ShowSpeechStateOptions , ReadingData , ISpeechFeedback } from './typings/mmir-base-dialog.d';
import { PromptReader } from './io/PromptReader';
import { SubscriptionUtil } from './util/SubscriptionUtil';



export {
  MmirProvider,
  VoiceUIProvider,
  PromptReader,
  IonicDialogManager,
  IonicMmirModule,
  ReadingOptions,
  StopReadingOptions,
  ReadingShowOptions,
  SpeechFeedbackOptions,
  RecognitionEmma,
  UnderstandingEmma,
  ShowSpeechStateOptions,
  SubscriptionUtil,
  IPromptHandler,
  ReadingData,
  ISpeechFeedback,
}
