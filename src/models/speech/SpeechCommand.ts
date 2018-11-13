
export type CmdType = 'nav' | 'show' | 'close' | 'read' | 'choose';

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
