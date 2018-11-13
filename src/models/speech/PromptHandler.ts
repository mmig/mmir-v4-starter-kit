
import { prepTts , prepareAcronyms , prepareAbbrevations , prepareDates , PromptType , isPromptId } from './PromptUtils';
import { ReadingData , IPromptHandler } from '../../providers/mmir';
import { AppReadingOptions } from './SpeechData';

export class PromptHandler implements IPromptHandler {

  willReadPrompt(contextId, readingId): boolean {
    return typeof readingId === 'number' && isPromptId(readingId);
  }

  preparePrompt(data: AppReadingOptions): string | Array<string> {

    if(data.readingId === PromptType.PROMPT_WELCOME){

      return this.doPrepareStartPrompt();

    } else if(data.readingId === PromptType.PROMPT_RESULTS){

      return this.doPrepareMessage(data.readingData, data.readingId);

    } else if(data.readingId === PromptType.PROMPT_ERROR){

      //TODO impl. function for reading appointment?
      return this.doPreparePrompt(data.readingData, data.readingId);

    }

    return null;
  }

  private doPrepareStartPrompt(): string {

    //NOTE inserted comma after "Mikrofonsymbol" to improve TTS audio (i.e. inserts a short pause)
    let startPrompt = 'Bitte tippen Sie auf das Mikrophon-Symbol, und stellen Sie eine Frage.';

    // this.doRead(startPrompt);
    return startPrompt;
  }

  private doPrepareMessage(answerPrompt: ReadingData, promptType: PromptType): Array<string> {

    const size: number = answerPrompt.promptText.length;
    const main = size > 1? answerPrompt.promptText[1] : answerPrompt.promptText[0];
    const caption = size > 1 && answerPrompt.promptText[0] ? answerPrompt.promptText[0] : '';

    //split into sentences, so that TTS can start after audio for 1st sentence was prepared
    // (instead of waiting for audio of complete text)
    let sentences: Array<string> = this.doPrepareSentences(
      //improve reading of acronyms by "spelling them out"
      prepTts(prepareAcronyms(main)), promptType
    );

    // if(caption){
      sentences.unshift(prepTts(caption));
    // }

    // this.doRead(sentences);
    return sentences;
  }

  private doPreparePrompt(answerPrompt: ReadingData, promptType: PromptType): Array<string> {

    //split into sentences, so that TTS can start after audio for 1st sentence was prepared
    // (instead of waiting for audio of complete text)
    let sentences: Array<string> = [];

    for(const part of answerPrompt.promptText){
      this.doPrepareSentences(
        //improve reading of acronyms by "spelling them out"
        prepTts(prepareAcronyms(part)), promptType, sentences
      );
    }

    // this.doRead(sentences);
    return sentences;
  }

  /**
   *
   * @param  [sentences] IN/OUT parameter: if specified, sentences will be appended to this array & it will be the return value
   * @return the (modified) sentences param, or if omitted a new string-array with the sentences
   */
  private doPrepareSentences(text: string, promptType: PromptType, sentences?: Array<string>): Array<string>{

    sentences = sentences || [];

    //read dates "<number> ten" (i.e. not "as subject", i.e. not as "<number> ter")
    let useDateAsSubject: boolean = false;//promptType !== PromptType.PROMPT_DEADLINES;

    //split at ". ", i.e. <dot> FOLLOWED BY <white-space> OR <end>)
    let preparedText: string = prepareAbbrevations( prepareDates(text, useDateAsSubject));
    const splitText = preparedText.split(/\.(\s|$)/m);
    for(let s of splitText){

      s = s.trim();
      //omit empty strings:
      if(s){
        sentences.push(s);
      }
    }
    return sentences;
  }
}
