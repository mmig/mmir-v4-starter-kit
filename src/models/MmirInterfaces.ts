
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
  require: RequireJs,
  startModule: string;//DEFAULT: 'main';
  viewEngine: string;//DEFAULT: "jqViewEngine";
  debug: boolean;//DEFAULT: true;
  logLevel: number | 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled';//DEFAULT: 'debug';
  logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true
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

  executeGrammar: (text: string, callback?: (semanticResult: {}) => void) => void;

  maskString:  (str: string, prefix?: string, postfix?: string) => string;
  maskAsUnicode:  (str: string) => string;
  unmaskString:  (str: string, detector?: RegExp) => string;

  unmaskJSON:  (json: any, isMaskValues?: boolean, isMaskNames?: boolean) => any;
  recodeJSON: (json: any, recodeFunc:(str:string)=>string, isMaskValues?: boolean, isMaskNames?: boolean) => any;

  encodeUmlauts: (target: string | {}, doAlsoEncodeUpperCase?: boolean) => string | {};

  decodeUmlauts: (target: string | {}, doAlsoEncodeUpperCase?: boolean) => string | {};

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

export interface SemanticInterpreter {

  getASRSemantic: (phrase: string, langCode?: string, callback?: (semanticResult: any) => void) => any;//TODO typ'ing result
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

export interface MmirModule extends MmirCore {

  CommonUtils: CommonUtils;
  ConfigurationManager: ConfigurationManager;
  Constants: Constants;
  ControllerManager: ControllerManager;
  DialogEngine: DialogEngine;
  DialogManager: DialogManager;
  InputEngine: InputEngine;
  InputManager: InputManager;
  LanguageManager: LanguageManager;
  MediaManager: MediaManager;
  ModelManager: ModelManager;
  NotificationManager: NotificationManager;
  PresentationManager: PresentationManager;
  SemanticInterpreter: SemanticInterpreter;


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
   loadAllCordovaPlugins: (pluginsPath: any, cbFunction: any) => any;
   loadCompiledGrammars: (generatedGrammarsPath: any, cbFunction: any, ignoreGrammarIds: any) => any;
   loadDirectoryStructure: (success: any, errorFunc: any) => any;
   loadImpl: (librariesPath: any, isSerial: any, completedCallback: any, checkIsAlreadyLoadedFunc: any, statusCallback: any) => any;
   loadScript: (url: any, successCallback: any, errorCallback: any, ...args: any[]) => any;
   parseParamsToDictionary: (urlParamsPartStrings: any) => any;
   resizeFitToSourroundingBox: (class_name: any) => void;
   setToCompatibilityMode: (success: any) => any;
   stripPathName: (pathname: any) => any;
}
export interface ConfigurationManager {
    get: (propertyName: any, useSafeAccess: any, defaultValue: any) => any;
    getBoolean: (propertyName: any, useSafeAccess: any, defaultValue: any) => any;
    getLanguage: () => any;
    getString: (propertyName: any, useSafeAccess: any, defaultValue: any) => any;
    set: (propertyName: any, value: any) => void;
    setLanguage: (lang: any) => void;
}
export interface Constants {
    getBasePath: () => any;
    getBeepUrl: () => any;
    getCompiledLayoutPath: () => any;
    getCompiledViewPath: () => any;
    getConfigurationFileUrl: () => any;
    getControllerPath: () => any;
    getDictionaryFileName: () => any;
    getDirectoriesFileUrl: () => any;
    getEnv: () => any;
    getEnvPlatform: () => any;
    getExtensionsPath: () => any;
    getGeneratedGrammarsPath: () => any;
    getGrammarFileName: () => any;
    getGrammarPluginPath: () => any;
    getHelperPath: () => any;
    getHelperSuffix: () => any;
    getLanguage: () => any;
    getLanguagePath: () => any;
    getLayoutPath: () => any;
    getMediaPluginPath: () => any;
    getModelPath: () => any;
    getPartialsPrefix: () => any;
    getPluginsPath: () => any;
    getSpeechConfigFileName: () => any;
    getViewPath: () => any;
    getWorkerPath: () => any;
    init: (theForBrowserParameter: any) => any;
    isBrowserEnv: () => any;
}
export interface ControllerManager {
    create: () => any;
    getController: (ctrlName: any) => any;
    getControllerNames: () => any;
    init: (callback: any, ctx: any) => any;
    perform: (ctrlName: any, actionName: any, data: any) => any;
    performHelper: (ctrlName: any, actionName: any, data: any, ...args: any[]) => any;
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
    getOnPageRenderedHandler: () => any;
    hideCurrentDialog: (...args: any[]) => void;
    hideWaitDialog: (...args: any[]) => void;
    perform: (ctrlName: any, actionName: any, data: any) => any;
    performHelper: (ctrlName: any, helper_method_name: any, data: any, ...args: any[]) => any;
    raise: (...args: any[]) => void;
    render: (ctrlName: any, viewName: any, data: any) => void;
    setOnPageRenderedHandler: (onPageRenderedHook: any) => void;
    showDialog: (ctrlName: any, dialogId: any, data: any, ...args: any[]) => void;
    showWaitDialog: (text: any, theme: any, ...args: any[]) => void;
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
    raise: (...args: any[]) => void;
}
export interface LanguageManager {
    determineLanguage: (lang: any) => any;
    existsDictionary: (lang: any) => any;
    existsGrammar: (lang: any) => any;
    existsSpeechConfig: (lang: any) => any;
    fixLang: (providerName: any, langCode: any) => any;
    getDefaultLanguage: () => any;
    getDictionary: () => any;
    getLanguage: () => any;
    getLanguageConfig: (pluginId: any, feature: any, separator: any) => any;
    getLanguages: () => any;
    getText: (textVarName: any) => any;
    init: (lang: any) => any;
    setLanguage: (lang: any) => any;
    setNextLanguage: () => any;
    setToCompatibilityMode: (success: any) => any;
}
export interface MediaManager {
    ctx: any;
    waitReadyImpl: any;
    addListener: (eventName: string, eventHandler: Function) => void;

    cancelRecognition: (successCallback?: Function, failureCallback?: Function) => void;
    cancelSpeech: (successCallBack?: Function, failureCallBack?: Function) => void;
    createEmptyAudio: () => any;

    getFunc: (ctx: any, funcName: any, ...args: any[]) => any;
    getListeners: (eventName: any) => any;
    getURLAsAudio: (url: any, onEnd: any, failureCallback: any, successCallback: any, audioObj: any, ...args: any[]) => any;
    getWAVAsAudio: (blob: any, callback: any, onEnd: any, failureCallback: any, onInit: any, emptyAudioObj: any) => any;
    hasListeners: (eventName: any) => any;
    init: (successCallback?: Function, failureCallback?: Function, listenerList?: any) => any;
    loadFile: (filePath: any, successCallback: Function, failureCallback: Function, execId: any) => void;
    off: (eventName: string, eventHandler: Function) => any;
    on: (eventName: string, eventHandler: Function) => void;
    perform: (ctx: string, funcName: string, args: Array<any>) => any;

    playURL: (url: any, onEnd?: Function, failureCallback?: Function, successCallback?: Function) => void;
    playWAV: (blob: any, onEnd?: Function, failureCallback?: Function, successCallback?: Function) => void;

    recognize: (successCallback?: Function, failureCallback?: Function, isIntermediateResults?: boolean) => void;
    removeListener: (eventName: string, eventHandler: Function) => any;
    setDefaultCtx: (ctxId: string) => void;
    setTextToSpeechVolume: (newValue: number) => void;
    startRecord: (successCallback?: Function, failureCallback?: Function, intermediateResults?: boolean) => void;

    stopRecord: (successCallback?: Function, failureCallback?: Function) => void;
    textToSpeech: (parameter: any, successCallback?: Function, failureCallback?: Function, onInit?: Function, options?: any, ...args: any[]) => void;


}
export interface MicLevelsAnalysis {
    active: (active: any) => any;
    enabled: (enable: any) => any;
    start: (audioInputData: any) => void;
    stop: () => void;
}
export interface ModelManager {
    getModel: (modelName: any) => any;
    getModels: () => any;
    init: () => any;
}
export interface NotificationManager {
    alert: (message: any, alertCallback: any, title: any, buttonName: any) => void;
    beep: (times: any) => void;
    confirm: (message: any, confirmCallback: any, title: any, buttonLabels: any) => void;
    createSound: (name: any, url: any, isKeepOnPause: any) => void;
    getVolume: () => any;
    init: () => any;
    initBeep: () => void;
    initSound: (name: any) => void;
    isVibrateAvailable: () => any;
    isVibrateEnabled: () => any;
    playSound: (name: any, times: any, onFinished: any, onError: any) => void;
    setVibrateEnabled: (enabled: any) => void;
    setVolume: (vol: any) => void;
    stopSound: (name: any) => void;
    vibrate: (milliseconds: any) => void;
}
export interface PresentationManager {
    pageIndex: number;
    addLayout: (layout: any) => void;
    addPartial: (ctrlName: any, partial: any) => void;
    addView: (ctrlName: any, view: any) => void;
    callRenderEngine: (funcName: any, args: any) => any;
    getLayout: (layoutName: any, doUseDefaultIfMissing: any) => any;
    getPartial: (controllerName: any, partialName: any) => any;
    getView: (controllerName: any, viewName: any) => any;
    hideCurrentDialog: (...args: any[]) => void;
    hideWaitDialog: (...args: any[]) => void;
    reRenderView: () => void;
    renderPreviousView: () => void;
    renderView: (ctrlName: any, viewName: any, data: any) => void;
    setRenderEngine: (theRenderEngine: any) => void;
    showDialog: (ctrlName: any, dialogId: any, data: any, ...args: any[]) => any;
    showWaitDialog: (text: any, data: any, ...args: any[]) => void;
}
export interface RequireJs extends Function {
    isBrowser: boolean;
    defined: (id: any) => any;
    specified: (id: any) => any;
    toUrl: (moduleNamePlusExt: any) => any;
    undef: (id: any) => void;
}
