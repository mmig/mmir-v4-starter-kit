
// import { QuestionIntent } from './QuestionRequest';

// public static readonly PROMPT_RESULTS_FOUND = 'results-found-prompt';
// export const PROMPT_WELCOME = 'welcome-prompt';
// export const PROMPT_RESULTS = 'results-prompt';
// export const PROMPT_DEADLINES = 'deadlines-prompt';
// export const PROMPT_TAX_YEAR = 'tax-year-prompt';

export enum PromptType {
  PROMPT_WELCOME, PROMPT_RESULTS, PROMPT_DEADLINES, PROMPT_TAX_YEAR, PROMPT_ERROR
}

export function isPromptId(id: number) : boolean {
  //TODO use enum for prompt IDs
  return id === PromptType.PROMPT_WELCOME || id === PromptType.PROMPT_RESULTS || id === PromptType.PROMPT_DEADLINES || id === PromptType.PROMPT_TAX_YEAR  || id === PromptType.PROMPT_ERROR;
}

// export function getPromptId(intent: QuestionIntent) : PromptType {
//   if(intent === 'rate' || intent === 'change')
//     return PromptType.PROMPT_RESULTS;
//   if(intent === 'deadline')
//     return PromptType.PROMPT_DEADLINES;
//   if(intent === 'duration')
//       return PromptType.PROMPT_TAX_YEAR;
//
//   return PromptType.PROMPT_ERROR;
// }

export function prepareAcronyms(text: string): string {

  const len = text.length;

  //replace "SUV" with explicit German pronounciation
  // text = text.replace(/\bSUV\b/g, 'Es Ju Wie,');TODO handle known special cases, that we know are treated incorretly by the TTS

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
