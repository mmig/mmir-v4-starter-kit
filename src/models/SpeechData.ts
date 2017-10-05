
import { IQuestionParams , QuestionResponse , QuestionResponseError } from './QuestionRequest';
// import { DialogueTurn } from './Utterance';

export interface ReadingOptions {
  //selecting reading target / text (subcategory) -- specific readingIds may specify system prompts
  readingId?: number;
  //target ID for restarting speech-input after prompt was read.
  targetId?: string;
  //should not actually start but only return TRUE if reading-request is valid (e.g. if reading is context-sensitive)
  test?: boolean;
  //if readingId refers to a general/type of prompt ID, this field may contain the concrete text that should be read and/or additional information for generating the prompt
  readingData?: ReadingData;
}

export interface ReadingShowOptions extends ReadingOptions {
  //context for reading target (may also be used for selecting reading target/text)
  dialogId: string;
  //if reading is active or inactive
  active: boolean;
}

export interface StopReadingOptions extends ReadingOptions {
  //context for reading target (may also be used for selecting reading target/text)
  dialogId: string;
  //when guided speech input is active: indicates that speech-guidance should be canceled
  cancelGuidance?: boolean;
}

export interface ReadingData {
  promptText?: string | Array<string>;//(general) system prompt that should be read to the user
  textCmds?: string;//text representing a command (or command list)
  tryCount?: number;//TODO remove? too app specific? -> re-try count for mis-/not understood commands
}

// export interface AnswerResponseData {
//   turn: DialogueTurn;
//   error?: QuestionResponseError;
//   params: IQuestionParams;
//   response?: QuestionResponse;
//   hint?: string;
// }
//
// export interface PromptData extends AnswerResponseData {
//   dialogId: string,
// }
