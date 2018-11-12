
export interface ReadingOptions {
  /**context for reading target (may also be used for selecting reading target/text)*/
  dialogId?: string;
  /**selecting reading target / text (subcategory) -- specific readingIds may specify system prompts*/
  readingId?: number;
  /**ID for reading control element, e.g. for displaying feedback/reading status*/
  readCtrlId?: string;
  /**target ID for restarting speech-input after prompt was read*/
  targetId?: string;
  /**should not actually start but only return TRUE if reading-request is valid (e.g. if reading is context-sensitive)*/
  test?: boolean;
  /**if readingId refers to a general/type of prompt ID, this field may contain the concrete text that should be read and/or additional information for generating the prompt*/
  readingData?: ReadingData;

  /**if true, cancels any active prompt and starts reading this prompt*/
  cancelActivePrompts?: boolean;
}

export interface ReadingShowOptions extends ReadingOptions {
  /**context for reading target (may also be used for selecting reading target/text)*/
  dialogId: string;
  /**if reading is active or inactive*/
  active: boolean;
}

export interface StopReadingOptions extends ReadingShowOptions {

  /**when guided speech input is active: indicates that speech-guidance should be canceled*/
  cancelGuidance?: boolean;

  /**indicates that current prompt/readingId stops, but another prompt will continue after this one has stopped*/
  continuesReading?: boolean;
}

export interface ReadingData {
  /**(general) system prompt that should be read to the user*/
  promptText?: string | Array<string>;
  /**text representing a command (or command list)*/
  textCmds?: string;
  tryCount?: number;//TODO remove? too app specific? -> re-try count for mis-/not understood commands
}

export interface WaitReadyOptions {
  state: 'wait' | 'ready';
  module: string;
}
