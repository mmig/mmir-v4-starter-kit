
import { ReadingOptions, ReadingShowOptions, StopReadingOptions } from '../../providers/mmir/typings/mmir-base-dialog.d';
import { PromptType } from './PromptUtils';


// export interface ReadingData {
//   /**(general) system prompt that should be read to the user*/
//   promptText?: string | Array<string>;
//   /**text representing a command (or command list)*/
//   textCmds?: string;
//   tryCount?: number;//TODO remove? too app specific? -> re-try count for mis-/not understood commands
// }

export interface AppReadingOptions extends ReadingOptions {
  readingId?: PromptType;
}

export interface AppReadingShowOptions extends ReadingShowOptions {
  readingId: PromptType;
}

export interface AppStopReadingOptions extends StopReadingOptions {
  readingId: PromptType;
}
