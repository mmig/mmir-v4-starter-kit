
/**
 * export global variable mmir
 */
export as namespace mmir;

/**
 * interface definition for JSON grammar
 */
export interface Grammar {

  example_phrase?: string;

  stop_word: Array<string>;

  tokens: { [id: string]: Array<string> };

  utterances: { [id: string]: { 'phrases': Array<string>, 'semantic': any } };

}

export interface MmirCore {
  // applyConfig: (mainConfig: {}) => void;//DISABLED: "officially" this function has visibility protected
  // setInitialized: () => void;//DISABLED: "officially" this function has visibility protected
  config: (requirejsConfig: {}) => void;
  ready: (onFrameworkReady: (...args: any[]) => any) => any;
  isVersion(verion: string, comparator: '>=' | '<=' | '>' | '<' | '!=' | '!==' | '=' | '==' | '==='): boolean;
  require: RequireJs;
  startModule: string;//DEFAULT: 'main';
  viewEngine: string;//DEFAULT: "jqViewEngine";
  debug: boolean;//DEFAULT: true;
  logLevel: number | 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled';//DEFAULT: 'debug';
  logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true
  version: string;
}

export interface MmirModule extends MmirCore {
  util: CommonUtils;
  conf: ConfigurationManager;
  const: Constants;
  ctrl: ControllerManager;
  dialogEngine: DialogEngine;
  dialog: DialogManager;
  inputEngine: InputEngine;
  input: InputManager;
  lang: LanguageManager;
  media: MediaManager;
  model: ModelManager;
  notifier: NotificationManager;
  present: PresentationManager;
  semantic: SemanticInterpreter;
}

// //mmir core module:
// export function config(requirejsConfig: {}): void;
// export function ready(onFrameworkReady: (...args: any[]) => any): any;
// export function isVersion(verion: string, comparator: '>=' | '<=' | '>' | '<' | '!=' | '!==' | '=' | '==' | '==='): boolean;
// export var require: RequireJs;
// export var startModule: string;//DEFAULT: 'main';
// export var viewEngine: string;//DEFAULT: "jqViewEngine";
// export var debug: boolean;//DEFAULT: true;
// export var logLevel: number | 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled';//DEFAULT: 'debug';
// export var logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true
// export var version: string;


// //mmir module (extending core module)
// export var util: CommonUtils;
// export var conf: ConfigurationManager;
// export var const: Constants;
// export var ctrl: ControllerManager;
// export var dialogEngine: DialogEngine;
// export var dialog: DialogManager;
// export var inputEngine: InputEngine;
// export var input: InputManager;
// export var lang: LanguageManager;
// export var media: MediaManager;
// export var model: ModelManager;
// export var notifier: NotificationManager;
// export var present: PresentationManager;
// export var semantic: SemanticInterpreter;

export interface Positions {
  str: string;
  pos: Array<Pos>;
}

export interface GrammarConverter {

  loadGrammar: (successCallback: ()=> any, errorCallback: ()=> any, grammarUrl: string, doLoadSynchronously?: boolean) => void;
  loadResource: (successCallback: ()=> any, errorCallback: ()=> any, resourceUrl: string, doLoadSynchronously?: boolean) => void;
  setStopWords: (stopWordArray: Array<string>) => void;
  getStopWords: () => Array<string>;
  getEncodedStopwords: () => Array<string>;
  parseStopWords: () => void;
  getStopWordsRegExpr: () => RegExp;
  getStopWordsEncRegExpr: () => RegExp;
  getGrammarDef: () => string;
  setGrammarDef: (rawGrammarSyntax: string) => void;
  getGrammarSource: () => string;
  setGrammarSource: (src_code: string) => void;

  setGrammarFunction: (execGrammarFunc: (text: string, callback?: (semanticResult: {}) => void) => void, isAsync?: boolean) => void;

  isAsyncExec: () => boolean;

  preproc(thePhrase: string, pos?: {stopwords: Array<Pos>}, maskFunc?: (inputStr : string, isCalcPosition?: boolean) => string | Positions, stopwordFunc?: (inputStr : string, pos?: Array<Pos>) => string | Positions): string;
  postproc(procResult: any, recodeFunc?: (inputStr : string, ...args: any[]) => string): any;

  executeGrammar: (text: string, callback?: (semanticResult: {}) => void) => void;

  maskString:  (str: string, computePositions?: boolean, prefix?: string, postfix?: string) => string | Positions;
  maskAsUnicode:  (str: string) => string;
  unmaskString:  (str: string, computePositions?: boolean, detector?: RegExp) => string | Positions;

  unmaskJSON:  (json: any, isMaskValues?: boolean, isMaskNames?: boolean) => any;
  recodeJSON: (json: any, recodeFunc:(str:string)=>string, isMaskValues?: boolean, isMaskNames?: boolean) => any;

  //semi-private fileds
  variable_prefix: string;
  variable_regexp: RegExp;

  entry_token_field: string;
  entry_index_field: string;
  enc_regexp_str: string;

  jscc_grammar_definition: string;
  js_grammar_definition: string;
  json_grammar_definition: Grammar;
  stop_words_regexp: RegExp;

  maskValues: boolean;
  maskNames: boolean;
  convertOldFormat: boolean;
}

export interface EncodeUtils {
  encodeUmlauts: (target: string | {}, doAlsoEncodeUpperCase?: boolean) => string | {};
  decodeUmlauts: (target: string | {}, doAlsoEncodeUpperCase?: boolean) => string | {};
}

export interface Pos {
  //index
  i: number;
  //original word length (i.e. before modification)
  len: number;
  //modified word legnth (i.e. after modification)
  mlen?: number;
}

export interface SemanticInterpreter {

  interpret: (phrase: string, langCode?: string, callback?: (semanticResult: any) => void) => any;//TODO typ'ing result
  removeStopwords: (thePhrase: string, lang?: string) => string;
  getGrammarDefinitionText: (id: string) => string;
  getGrammarParserText: (id: string) => string;
  getGrammarConverter: (id: string) => GrammarConverter;
  createGrammar: (rawGrammarSrc: string | {}, id: string, callback?: (created?: GrammarConverter) => void) => SemanticInterpreter;
  addGrammar: (id: string, grammarImpl: (text: string, callback?: (semanticResult: {}) => void) => void | GrammarConverter, fileFormatNo?: number) => void;
  setStopwords: (id: string, stopwordArray: Array<string>) => void;
  hasGrammar: (id: string) => boolean;
  removeGrammar: (id: string) => void;
  setCurrentGrammar: (id: string) => void;
  getCurrentGrammar: () => string;
  setEnabled: (isEnabled: boolean) => void;
  isEnabled: () => boolean;
  getGrammarEngine: () => "jscc" | "jison" | "pegjs";//DEFAULT: "jscc"
  setGrammarEngine: (engineId: "jscc" | "jison" | "pegjs", asyncCompileMode?: boolean) => void;
  setEngineCompileMode: (asyncCompileMode: boolean) => void;//DEFAULT: false
  getFileVersion: () => number;

  get_json_grammar_url: (id: string) => string;//NOTE may get removed/renamed
}

//////////////////////////////////////////////////////////// TODO //////////////////////////////////////////////////////

export interface CommonUtils {
  regexHTMLComment: RegExp;
   checkNetworkConnection: () => any;
   concatArray: (array: any) => any;
   getCompiledGrammarPath: (generatedGrammarsPath: any, grammarId: any, isFileNameOnly: any) => any;
   getDirectoryContents: (pathname: any) => any;
   getDirectoryContentsWithFilter: (pathname: any, filter: any) => any;
   getDirectoryStructure: () => any;
   getLocalScript: (scriptUrl: any, success: any, fail: any, ...args: any[]) => void;
   getPartialsPrefix: () => any;
   init: (onsuccess: any, onerror: any) => any;
   isArray: (object: any) => any;
   isRunningOnAndroid: () => any;
   isRunningOnSmartphone: () => any;
   loadCompiledGrammars: (generatedGrammarsPath: any, cbFunction: any, ignoreGrammarIds: any) => any;
   loadDirectoryStructure: (success: any, errorFunc: any) => any;
   loadImpl: (librariesPath: any, isSerial: any, completedCallback: any, checkIsAlreadyLoadedFunc: any, statusCallback: any) => any;
   loadScript: (url: any, successCallback: any, errorCallback: any, ...args: any[]) => any;
   parseParamsToDictionary: (urlParamsPartStrings: any) => any;
   resizeFitToSourroundingBox: (class_name: any) => void;
   stripPathName: (pathname: any) => any;
}
export interface ConfigurationManager {
    get: (propertyName: string, defaultValue?: any, useSafeAccess?: boolean) => any;
    getBoolean: (propertyName: string, defaultValue?: any, useSafeAccess?: boolean) => boolean;
    getString: (propertyName: string, defaultValue?: any, useSafeAccess?: boolean) => string;
    set: (propertyName: string, value: any) => void;
}
export interface Constants {
    getBasePath: () => string;
    getBeepUrl: () => string;
    getCompiledLayoutPath: () => string;
    getCompiledViewPath: () => string;
    getConfigurationFileUrl: () => string;
    getControllerPath: () => string;
    getDictionaryFileName: () => string;
    getDirectoriesFileUrl: () => string;
    getEnv: () => any;
    getEnvPlatform: () => any;
    getExtensionsPath: () => string;
    getGeneratedGrammarsPath: () => string;
    getGrammarFileName: () => string;
    getGrammarPluginPath: () => string;
    getHelperPath: () => string;
    getHelperSuffix: () => string;
    getLanguage: () => string;
    getLanguagePath: () => string;
    getLayoutPath: () => string;
    getMediaPluginPath: () => string;
    getModelPath: () => string;
    getPartialsPrefix: () => string;
    getSpeechConfigFileName: () => string;
    getViewPath: () => string;
    getWorkerPath: () => string;
    init: (theForBrowserParameter: any) => any;
    isBrowserEnv: () => boolean;
    isCordovaEnv: () => boolean;
}
export interface ControllerManager {
    create: () => any;
    get: (ctrlName: string) => Controller | undefined;
    getNames: () => Array<string>;
    init: (callback: any, ctx: any) => any;
    perform: (ctrlName: string, actionName: string, data?: any) => any;
    performHelper: (ctrlName: string, actionName: string, data?: any) => any;
}
export interface DialogEngine {
    doc: string;
    name: string;
    url: string;
    getActiveEvents: () => any;
    getActiveStates: () => any;
    getActiveTransitions: () => any;
    getEvents: () => any;
    getStates: () => any;
    getTransitions: () => any;
    ignoreScript: () => void;
    load: (...args: any[]) => any;
    onload: (scion: any, deferred: any) => void;
    onraise: () => void;
    raise: (event: any, eventData: any) => void;
    start: () => void;
}
export interface DialogManager {
    getOnPageRenderedHandler: () => Function | undefined;
    hideCurrentDialog: () => void;
    hideWaitDialog: () => void;
    perform: (ctrlName: any, actionName: any, data?: any) => any;
    performHelper: (ctrlName: any, helper_method_name: any, data?: any) => any;
    raise: (eventName: string, data?: any) => void;
    render: (ctrlName: any, viewName: any, data?: any) => void;
    setOnPageRenderedHandler: (onPageRenderedHook: Function) => void;
    showDialog: (ctrlName: any, dialogId: any, data?: any) => void;
    showWaitDialog: (text: any, theme: any) => void;
}
export interface InputEngine {
    doc: string;
    name: string;
    url: string;
    getActiveEvents: () => any;
    getActiveStates: () => any;
    getActiveTransitions: () => any;
    getEvents: () => any;
    getStates: () => any;
    getTransitions: () => any;
    ignoreScript: () => void;
    load: (...args: any[]) => any;
    onload: (scion: any, deferred: any) => void;
    onraise: () => void;
    raise: (event: any, eventData: any) => void;
    start: () => void;
}
export interface InputManager {
    raise: (eventName: string, data?: any) => void;
}
export interface LanguageManager {
    determineLanguage: (lang: string) => string;
    existsDictionary: (lang: string) => boolean;
    existsGrammar: (lang: string) => boolean;
    existsSpeechConfig: (lang: string) => boolean;
    fixLang: (providerName: string, langCode: string) => string;
    getDefaultLanguage: () => string;
    getDictionary: () => {[id:string]: string};
    getLanguage: () => string;
    getLanguageConfig: (pluginId: string, feature: string, separator?: string) => any;
    getLanguages: () => Array<string>;
    getText: (textVarName: string) => string;
    init: (lang: string) => any;
    setLanguage: (lang: string) => any;
}
export interface MediaManager {
    ctx: {[ctxId: string]: any};
    waitReadyImpl: IWaitReadyImpl;

    init: (successCallback?: Function, failureCallback?: Function, listenerList?: Array<{name: string, listener: Function}>) => any;
    loadFile: (filePath: string, successCallback?: Function, failureCallback?: Function, execId?: string) => void;

    addListener: (eventName: string, eventHandler: Function) => void;
    hasListeners: (eventName: string) => boolean;
    getListeners: (eventName: string) => Function | void;
    removeListener: (eventName: string, eventHandler: Function) => boolean;
    off: (eventName: string, eventHandler: Function) => boolean;
    on: (eventName: string, eventHandler: Function) => void;

    createEmptyAudio: () => IAudio;
    getURLAsAudio: (url: string, onEnd: any, failureCallback: any, successCallback: any, audioObj: IAudio, ...args: any[]) => IAudio;
    getWAVAsAudio: (blob: any, callback: any, onEnd: any, failureCallback: any, onInit: any, emptyAudioObj: IAudio) => IAudio;
    playURL: (url: string, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onReady?: Function) => void;
    playWAV: (blob: any, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onReady?: Function) => void;

    getFunc: (ctx: string, funcName: string) => any;
    perform: (ctx: string, funcName: string, args?: Array<any>) => any;
    setDefaultCtx: (ctxId: string) => void;

    recognize: (options?: ASROptions, statusCallback?: ASROnStatus, failureCallback?: ASROnError, isIntermediateResults?: boolean) => void;
    startRecord: (options?: ASROptions, successCallback?: ASROnStatus, failureCallback?: ASROnError, intermediateResults?: boolean) => void;
    stopRecord: (options?: ASROptions, successCallback?: ASROnStatus, failureCallback?: ASROnError) => void;

    tts: (options: TTSOptions, successCallback?: TTSOnComplete, failureCallback?: TTSOnError, onInit?: TTSOnReady, ...args: any[]) => void;
    setTextToSpeechVolume: (newValue: number) => void;

    cancelRecognition: (successCallback?: Function, failureCallback?: Function) => void;
    cancelSpeech: (successCallBack?: Function, failureCallBack?: Function) => void;

    // internal / "half public" functions (for use in plugin implementations)
    _fireEvent: (eventName: string, args: any[]) => void;

    _addListenerObserver: (eventName: string, observerCallback: (actionType: "added" | "removed", eventHandler) => void) => void;
    _removeListenerObserver: (eventName: string, observerCallback: (actionType: "added" | "removed", eventHandler) => void) => void;
    _notifyObservers: (eventName: string, actionType: "added" | "removed", eventHandler) => void;

    _preparing: (moduleName: string) => void;
    _ready: (moduleName: string) => void;
}

export interface TTSOptions {
    text: string | string[];//<- text that should be read aloud
    pauseDuration?: number;//<- the length of the pauses between sentences (i.e. for String Arrays) in milliseconds
    language?: string;//<- the language for synthesis (if omitted, the current language setting is used)
    voice?: string;//<- the voice (language specific) for synthesis; NOTE that the specific available voices depend on the TTS engine
    success?: TTSOnComplete;//<- the on-playing-completed callback (see arg onPlayedCallback)
    error?: TTSOnError;//<- the error callback (see arg failureCallback)
    ready?: TTSOnReady;//<- the audio-ready callback (see arg onReadyCallback)
}

export interface ASROptions {
    success?: ASROnStatus;//<- the status-callback (see arg statusCallback)
    error?: ASROnError;//<- the error callback (see arg failureCallback)
    language?: string;//<- the language for recognition (if omitted, the current language setting is used)
    intermediate?: boolean;//<- set true for receiving intermediate results (NOTE not all ASR engines may support intermediate results)
    results?: number;//<- set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)
    mode?: "search" | "dictation";//<- set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)
    eosPause?: "short" | "long";//<- length of pause after speech for end-of-speech detection (NOTE not all ASR engines may support this option)
    disableImprovedFeedback?: boolean;//<- disable improved feedback when using intermediate results (NOTE not all ASR engines may support this option)
}

export type TTSOnComplete = () => void;
export type TTSOnError = (error: string | Error) => void;
export type TTSOnReady = (isReady?: Boolean, audio?: IAudio) => void;

export type ASROnStatus = (text: string | "", confidence: number | undefined, status: ASRStatus, alternatives?: Array<{result: string, score: number}>, unstable?: string) => void;
export type ASRStatus = "FINAL" | "INTERIM" | "INTERMEDIATE" | "RECORDING_BEGIN" | "RECORDING_DONE";
export type ASROnError = (error: string | Error) => void;

export interface IAudio {
	_constructor: (url: string, onPlayedCallback: TTSOnComplete, failureCallBack: TTSOnError, onLoadedCallBack: TTSOnReady) => IAudio;
	play:  () => void;
	stop:  () => void;
	enable: () => void;
	disable: () => void;
	release: () => void;
	setVolume:  (volume: number) => void;
	getDuration: () => number;
	isPaused: () => boolean;
	isEnabled: () => boolean;
}

export interface IWaitReadyImpl {
  preparing: (moduleName: string) => void;
  ready: (moduleName: string) => void;
}

export interface MicLevelsAnalysis {
    active: (active: any) => any;
    enabled: (enable: any) => any;
    start: (audioInputData: any) => void;
    stop: () => void;
}
export interface ModelManager {
    get: (modelName: string) => any;
    getNames: () => Array<string>;
    init: () => any;
}
export interface NotificationManager {
    alert: (message: string, alertCallback: Function, title: string, buttonName: string) => void;
    confirm: (message: string, confirmCallback: Function, title: string, buttonLabels: string[]) => void;
    beep: (times: number) => void;
    createSound: (name: string, url: string, isKeepOnPause: boolean) => void;
    getVolume: () => number;
    init: () => any;
    initBeep: () => void;
    initSound: (name: string) => void;
    isVibrateAvailable: () => boolean;
    isVibrateEnabled: () => boolean;
    playSound: (name: string, times: number, onFinished: Function, onError: Function) => void;
    setVibrateEnabled: (enabled: boolean) => void;
    setVolume: (vol: number) => void;
    stopSound: (name: string) => void;
    vibrate: (milliseconds: number) => void;
}
export interface PresentationManager {
    pageIndex: number;
    addLayout: (layout: Layout) => void;
    addPartial: (ctrlName: string, partial: Partial) => void;
    addView: (ctrlName: string, view: View) => void;
    callRenderEngine: (funcName: string, args: Array<any>) => any;
    getLayout: (layoutName: string, doUseDefaultIfMissing: boolean) => any;
    getPartial: (controllerName: string, partialName: string) => any;
    getView: (controllerName: string, viewName: string) => any;
    hideCurrentDialog: (...args: any[]) => void;
    hideWaitDialog: (...args: any[]) => void;
    render: (ctrlName: string, viewName: string, data?: any) => void;
    setRenderEngine: (theRenderEngine: RenderEngine) => void;
    showDialog: (ctrlName: string, dialogId: string, data?: any, ...args: any[]) => any;
    showWaitDialog: (text: string, data: any, ...args: any[]) => void;
}
export interface RequireJs extends Function {
    isBrowser: boolean;
    defined: (id: any) => any;
    specified: (id: any) => any;
    toUrl: (moduleNamePlusExt: any) => any;
    undef: (id: any) => void;
    config: (any) => void;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface RenderEngine {
    hideCurrentDialog(): void;
    hideWaitDialog(): void;
    render(ctrlName: string, viewName: string, view: View, ctrl: Controller, data?: any): void;
    showDialog(ctrlName: string, dialogId?: string, data?: any): void;
    showWaitDialog(text?: string, theme?: string): void;
}

export interface Layout {
    constructor(name: string, definition: string, remote?: boolean, ignoreMissingBody?: boolean);

    getBodyContents(): string;
    getDialogsContents(): string;
    getHeaderContents(): string;

    getName(): string;
    getYields(): Array<YieldDeclaration>;
    stringify(): string;

    //static TagElement(tag: any, content: any, tagType: any): any;
    //static getTagAttr(str: any, target: any): any;
}

export interface YieldDeclaration {
    constructor(parsingElement: ParsingResult, contentAreaType: any);

    getName(): string;
    getNameType(): number;

    getAreaType(): number;
    getEnd(): number;
    getStart(): number;

    getValue(rawPropertyValue: any, proptertyType: any, data: any): any;
    stringify(): string;
}

export interface View {
    constructor(ctrl: any, name: string, definition: string);

    getContentElement(name: string): ContentElement;
    getController(): Controller;
    getDefinition(): string;
    getName(): string;
    stringify(): string;
}

export interface Partial {
    constructor(ctrl: Controller, name: string, definition: string);

    getContentElement(): ContentElement;
    getController(): Controller;
    getDefinition(): string;
    getName(): string;
    stringify(): string;
}

export interface ContentElement {
    constructor(group: ParsingResult|Array<string>|{name: string, content: string, offset?: number, parent?: ContentElement}, view: View, parser: any, renderer: any, ...args: any[]);

    getController(): Controller;

    getDefinition(): string;

    getEnd(): number;

    getName(): string;

    getOffset(): number;

    getRawText(): string;

    getStart(): number;

    getView(): View;

    hasDynamicContent(): boolean;

    stringify(): string;

    toHtml(): string;

    toStrings(renderingBuffer?: Array<string>, data?: any): any;

}

export interface ParsingResult {
    constructor(thetokens: any);

    getCallDataEnd(): number;

    getCallDataStart(): number;

    getCallDataType(): string;

    getEnd(): number;

    getStart(): number;

    getType(): number;

    getTypeName(): string;

    getValue(rawPropertyValue: any, proptertyType: any, data: any): any;

    hasCallData(): boolean;

    hasElse(): boolean;

    hasVarReferences(): boolean;

    isElse(): boolean;

    isEscape(): boolean;

    isEscapeEnter(): boolean;

    isEscapeExit(): boolean;

    isFor(): boolean;

    isHelper(): boolean;

    isIf(): boolean;

    isLocalize(): boolean;

    isRender(): boolean;

    isScriptBlock(): boolean;

    isScriptStatement(): boolean;

    isScriptTag(): boolean;

    isStyleTag(): boolean;

    isYield(): boolean;

    isYieldContent(): boolean;

    setEndFrom(thetokens: any): void;

    setStartFrom(thetokens: any): void;

    stringify(): string;

}

export type FileInfo = {name: string, path: string, fileName?: string};

export interface Helper {
    constructor(ctrl: string, name: string, ctx: any);
    perform(actionName: string, data?: any, ...args: any[]): any;
}

export interface Controller {
    constructor(name: any, jsonDef: any, ctx: any);

    getName(): string;

    getHelper(): Helper;

    getLayoutName(): string;
    getPartialNames(): Array<string>;
    getViewNames(): Array<string>;

    perform(actionName: string, data: any, ...args: any[]): any;
    performHelper(actionName: string, data: any, ...args: any[]): any;
    performIfPresent(actionName: string, data: any, ...args: any[]): any;

    getPartials(): Array<FileInfo>;
    getViews(): Array<FileInfo>;
    getLayout(): FileInfo;
    parsePartials(partialDefs: Array<FileInfo>): void;
    parseViews(viewDefs: Array<FileInfo>): void;
    loadHelper(name: string, helperPath: string, ctx: any): void;

}
