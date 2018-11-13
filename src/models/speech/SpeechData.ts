
import { ReadingOptions, ReadingShowOptions, StopReadingOptions } from '../../providers/mmir';
import { PromptType } from './PromptUtils';

export interface AppReadingOptions extends ReadingOptions {
  readingId?: PromptType;
}

export interface AppReadingShowOptions extends ReadingShowOptions {
  readingId: PromptType;
}

export interface AppStopReadingOptions extends StopReadingOptions {
  readingId: PromptType;
}
