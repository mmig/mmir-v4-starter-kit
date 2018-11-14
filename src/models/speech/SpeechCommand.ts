
import { Cmd } from '../../providers/mmir/typings/mmir-base-dialog.d';

export type CmdType = 'nav' | 'show' | 'close' | 'read' | 'choose' | 'nomatch';

export interface CmdParam {
    // field: string;
}

export interface NavCmdParam {
    target: string;
}

export interface ShowCmdParam {
    field: 'commands' | 'notice' | 'details';
}

export interface CloseCmdParam {
    target: 'commands' | 'speech';
}

export interface ReadCmdParam {
    field: 'all' | 'traveltime' | 'distance';
}

export interface ChooseCmdParam {
    field: 'edit' | 'option' | 'caption' | 'switch';
}

export interface AppCmd extends Cmd {
  semantic?: {
    type: CmdType,
    param: CmdParam
  };
  preproc: string;//evaluated phrase (may be only part of the ASR text)
  phrases?: Array<PhraseInfo>;
}

export interface PhraseInfo {
  i: number,//index within phrase
  type: string,//token type
  tok: string//recognized token
}
