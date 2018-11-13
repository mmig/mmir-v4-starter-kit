
// public static readonly PROMPT_WELCOME = 'welcome-prompt';
// public static readonly PROMPT_MESSAGE_TEXT = 'message-prompt';

export enum PromptType {
  PROMPT_WELCOME, PROMPT_RESULTS, PROMPT_ERROR
}

export function isPromptId(id: number) : boolean {
  //TODO use enum for prompt IDs
  return id === PromptType.PROMPT_WELCOME || id === PromptType.PROMPT_RESULTS || id === PromptType.PROMPT_ERROR;
}

/**
 * prepare text for TTS output: reformat etc. the text for "better sounding"
 * speech synthesis.
 * @param  {string} text the text for TTS
 * @return {string}      modified text for better TTS results
 */
export function prepTts(text: string): string {
  //TODO more processing(?)
  let newText = text.replace(/</g, 'kleiner')
                      .replace(/>/g, 'größer');

  return newText;
}

export function prepareAcronyms(text: string): string {

  const len = text.length;

  //try to space-out letters in acronyms:
  let re = /([ABCDEFGHIJKLMNOPQRSTUVWXYZ][ABCDEFGHIJKLMNOPQRSTUVWXYZ]+)/g;//<- RegExp for detecting acronyms (i.e. with 2 or more upper-case chars in a row)
  text = text.replace(re, (acronym, match1, index) => {

    //insert spaces between chars of detected acronym
    let pronounciation = acronym.split('').join(' ');

    //if acronym is followed by a whitespace, insert a comma (i.e. add a short pause for TTS)
    let nextCharPos = index + acronym.length;//<- really: index + (acronym.length - 1) + 1
    if(nextCharPos < len - 2 && /\s/.test(text.charAt(nextCharPos))){
      pronounciation += ',';
    }

    return pronounciation;
  });

  return text;
}


export function prepareAbbrevations(text: string): string{

  //handle some specific abbrevations
  let newText = text.replace(/\bFr\./g, 'Frau');
  newText = newText.replace(/\bHr\./g, 'Herr');
  newText = newText.replace(/\bTel\./g, 'Telefon');
  newText = newText.replace(/\bbzw\./g, 'beziehungsweise');

  return newText;
}

export function prepareDates(text: string, isSubject?: boolean): string{

  //isSubject: by default true (except it is explicitly disabled)
  isSubject = isSubject !== false;

  //transform dates with preceeding article
  let newText = text.replace(/\sder\s1\.\s/igm, ' der erste ').replace(/\sder\s(\d\d?)\.\s/igm, ' der $1 te ');

  //transform dates so that they are read "date-like"
  if(isSubject){
    return newText.replace(/(\D)1\.\s/igm, '$1erster ').replace(/(\D\d\d?)\.\s/igm, '$1 ter ');/////////////// EARLY EXIT
  } else {
    return newText.replace(/(\D)1\.\s/igm, '$1ersten ').replace(/(\D\d\d?)\.\s/igm, '$1 ten ');/////////////// EARLY EXIT
  }
  //TODO impl. general handling?
}
