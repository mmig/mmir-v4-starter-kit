
import { Subscription } from 'rxjs/Subscription';
import { IonicMmirModule , MmirProvider } from '../mmir-provider';

export const SPEECH_ACTIVE: string = 'speech-input-active';
export const READ_ACTIVE: string = 'speech-output-active';
export const DICTATION_CONTROL: string = 'dictation-ctrl';
export const READ_CONTROL: string = 'read-ctrl';

export interface MmirAppModule extends IonicMmirModule {
  app: any;
}

export interface MmirAppProvider extends MmirProvider {
  mmir: MmirAppModule;
}

export interface SpeechEventSubscription {
  showSpeechInputState?: Subscription;
  changeMicLevels?: Subscription;
  waitReadyState?: Subscription;
  showDictationResult?: Subscription;
  determineSpeechCmd?: Subscription;
  execSpeechCmd?: Subscription;
  cancelSpeechIO?: Subscription;
  read?: Subscription;
  stopReading?: Subscription;
  showReadingStatus?: Subscription//;
  //'resetGuidedInputForCurrentControl' | 'startGuidedInput' | 'resetGuidedInput' | 'isDictAutoProceed'
}

export interface ISpeechView {
  isActiveView: boolean;
}
