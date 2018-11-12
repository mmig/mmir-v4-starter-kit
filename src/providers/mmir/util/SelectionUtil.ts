
export interface SelectionOptions {
  /** reuse shadow DIV that is used for calculating the caret coordinates (DEFAULT: false)*/
  reuse?: boolean;
  returnHeight?: boolean;
  returnDiv?: boolean;
  /** the id attribute for the shadow DIV (DEFAULT: "input-textarea-caret-position-mirror-div") */
  id?: string;
  /**	BOOLEAN | FUNCTION: if TRUE, styling of the shadow DIV is not updated, if the current target element has the same type (Tag Name) as the previous one.
   * 																If function: a callback for determining, if the shadow DIV's style should be updated (return TRUE, if it shoud get updated): callback(shadowDiv) : BOOLEAN
   * 																NOTE this option is only relevant, if "reuse" is TRUE.
   * 																(DEFAULT: false)
   */
  guessIfUpdateStyle?: boolean | ((element: HTMLElement) => boolean);// function(div: HTMLElement) => boolean;
  /** force updating the style of the shadow DIV; only relevant, if "reuse" is TRUE (DEFAULT: false)*/
  forceUpdateStyle?: boolean;

  /** force faux span to use "cleared" style (e.g. in case SPAN is globally styled) (DEFAULT: false) */
  forceClearFauxStyle?: boolean;

  /** use ID for faux span (e.g. for styling faux span) (DEFAULT: undefined)*/
  fauxId?: string

  /** the text value that should be used for the calculation.
   *  If function: a callback which's return value is used as the text: <code>callback(element, options) : string</code>
   */
  text?: string | ((element: HTMLElement, options: SelectionOptions) => void);

  /** transfers additional styles properties from the target element to the shadow DIV*/
  additionalStyles?: Array<string>;

  /** transfers additional (node) attributes from the target element to the shadow DIV*/
  additionalAttributes?: Array<string>;

  /** if TRUE, allows text-wrapping for INPUT elements (note: the W3C specifically states that text in INPUT will not be wrapped, even if styles would "request" it, like "word-wrap: break-word" or "word-break: break-all | break-word" or similar)*/
  allowInputWrap?: boolean;

  /** apply zoom factor to font-size when measuring position:
   *   necessary for getting exact position, when font-zoom (e.g. accessibility functions) is active
   *   -> set true, if fontZoom should be calculated
   */
  fontZoom?: number | boolean;
}

const PREV_FONT_SIZE 		= 'tsp_pfontsize';//previous value for font-size of selection-marker target (String)
const PREV_LINE_HEIGHT	= 'tsp_plineheight';//previous value for line-height in pixels of selection-marker target (Integer)

//try to minimize calculation effort for selection marker:
//reuse shadow DIV & try to avoid (re-) styling the shadow DIV
var _selOpt: SelectionOptions = {
	//for faster execution, this can be set to TRUE (tries to avoid unnecessary re-styling when calculating caret-coordinates):
	//    if TRUE, styling of the DIV (for calculating the the caret-position) is only re-set
	//    when the targeted TAG (i.e. <input> vs. <textarea>) changes
	// -> should only be set to TRUE, if all speech-enabled <input>-tags are styled the same, and all speech-enabled <textarea>-tags are styled the same
	guessIfUpdateStyle: false,
	//overwrite/clear any global styles for <span> so that the faux-span for calculating the seletction-position works correctly
	 forceClearFauxStyle: true,
	//if TRUE, the DIV for calculating the the caret-position is re-used
	reuse: true,

	//apply zoom factor to font-size when measuring position:
	// necessary for getting exact position, when font-zoom (e.g. accessibility functions) is active
	// -> set true so that fontZoom will be calculation upon first invocation
	fontZoom: true
};

var _selectionColor = '#0094FF';


//CSS class name for cursor animation
var _cursorBlinkClass = 'text-selection-cursor-blink';
//CSS style for cursor (i.e. selection with length 0)
var _cursorStyle = 'background-color: black !important; opacity:1 !important;';//TODO make this settable?//TODO use target's font-color as background-color
//CSS animation style for cursor (blinking)
var _blinkAnimation = '@keyframes ' + _cursorBlinkClass +
						' { 50% { opacity: 0.0; } }\n@-webkit-keyframes ' + _cursorBlinkClass +
						' { 50% { opacity: 0.0; } }\n.' + _cursorBlinkClass +
						' { animation: ' + _cursorBlinkClass +
						' 1s steps(15, start) infinite; -webkit-animation: ' + _cursorBlinkClass +
						' 1s steps(15, start) infinite; ' + _cursorStyle +
						'}';

//CSS class name for selection marker DIV
var _selectionMarkerClass = 'text-selection-marker-div';
/**
 *
 * @param {HTMLElement|Boolean} [parentElement]
 * 				if FALSE, the created marker will not be attached to any parent-element.
 * 				If an HTMLElement, then the created marker will be attached to this parent-element.
 * 				If omitted (or TRUE), then the created marker will be attached to the document's body-element.
 * @returns {HTMLElement} the marker DIV
 */
function createSelectionMarker(parentElement: Element | boolean, isCreateBlinkStyle?: boolean){

	var isAttach = parentElement !== false;
	parentElement = !parentElement || parentElement === true? document.body : parentElement;

	var rect = document.createElement('div');
	rect.classList.add(_selectionMarkerClass);

	rect.style.display = 'none';//<- hide on initialization
	rect.style.position = 'absolute';
	rect.style.pointerEvents = 'none';//<- let click/touch-events etc. through to the underlying element(s)
	rect.style.width = '1px';//<- set initial size to simulate the "cursor"

	rect.style.backgroundColor = _selectionColor;
	rect.style.opacity = '0.2';//FIXME TEST for single block-marker

	if(isCreateBlinkStyle){
		var blink = document.createElement('style');
		blink.textContent = _blinkAnimation;
		rect.appendChild(blink);
	}

	if(isAttach)
		parentElement.appendChild(rect);

	return rect;
}

export class SelectionUtil {

  public _debug: boolean = false;

  private _selMarkerStart;
  private _selMarkerEnd;
  private _selMarkerBlock;

  constructor(private unitUtil, private caretPos){}


clearSelectionMarker(){
  this.setSelectionMarker(null, -1, -1);
}
/**
 * Auxiliary selection marker for text-input fields:
 * if a text-input control looses its focus, the selection may not get displayed anymore.
 *
 * This utility function creates a marker DIV and displays the selection regardless of the
 * focus-status.
 *
 * The implementation takes care, that there will be only 1 selection-marker
 * at a time (i.e. no markers in multiple controls).
 *
 * @param {HTMLElement} elem
 * 			the textarea/input for the selection.
 * 			If NULL, the selection marker will be cleared.
 * @param {Number} start
 * 			the starting index for the selection
 * @param {Number}
 * 			the length of the selection
 * @param {Boolean} [forceDisplay] OPTIONAL
 * 			if present and TRUE, display of selection marker will be forced
 * 			(i.e. shown, even if elem has focus, length is 0, ...)
 *
 */
setSelectionMarker(elem: HTMLInputElement | HTMLTextAreaElement | null, start: number, length: number, target?: &{container: any, fieldName: string} | string, forceDisplay?: boolean){

  if(typeof target === 'boolean'){
    forceDisplay = target;
    target = void(0);
  }

	//only show marker:
	// * if elem is defined (if not: clear marker)
	// * for selection *ranges* (i.e. do not show caret)
	// * if elem is not focused (if focused, the build-in functionality of textarea/input will show the selection)
	if(!forceDisplay && this._selMarkerStart && (!elem || /*length === 0 ||*/ document.activeElement === elem)){

    if(this._debug) console.log('clearSelectionMarker()');

		this._selMarkerStart.style.display = 'none';

		if(this._selMarkerEnd)
			this._selMarkerEnd.style.display = 'none';

		if(this._selMarkerBlock)
			this._selMarkerBlock.style.display = 'none';

		return;/////////////EARLY EXIT/////////////////////
	}

	if(!elem){
		return;/////////////EARLY EXIT/////////////////////
	}

  if(target){
    if(typeof target === 'string'){
      _selOpt.text = target;
    } else {
      (_selOpt as any)._container = target.container;
      (_selOpt as any)._fieldName = target.fieldName;
      _selOpt.text = function(): string {
        return this._container[this._fieldName];
      }
    }
  }

  if(this._debug) console.log('setSelectionMarker -> ['+start+', '+(start + length)+']');

	var pos1 = this.caretPos.getCoordinates(elem, start, _selOpt);
	var pos2 = this.caretPos.getCoordinates(elem, start + length, _selOpt);

	var offsetTop = elem.offsetTop - elem.scrollTop;
	var offsetLeft = elem.offsetLeft - elem.scrollLeft;

	var offsetParent = elem.offsetParent;

	if(!this._selMarkerStart){
		this._selMarkerStart = createSelectionMarker(offsetParent, true);
	}

	var parent;//TODO need to detect, if the marker was removed (e.g. due to page change etc)
	if(offsetParent){//HACK: insert marker into relative-parent of target-element => will be moved correctly on scrolling etc.
		if(offsetParent && offsetParent !== this._selMarkerStart.parentElement){
			this._selMarkerStart.parentElement.removeChild(this._selMarkerStart);
			if(this._selMarkerEnd) this._selMarkerEnd.parentElement.removeChild(this._selMarkerEnd);//TODO do this only if it will be displayed
			if(this._selMarkerBlock) this._selMarkerBlock.parentElement.removeChild(this._selMarkerBlock);//TODO do this only if it will be displayed
			parent = offsetParent;
		}
	} else {
		if(this._selMarkerStart.parentElement !== document.body){
			this._selMarkerStart.parentElement.removeChild(this._selMarkerStart);
			if(this._selMarkerEnd) this._selMarkerEnd.parentElement.removeChild(this._selMarkerEnd);//TODO do this only if it will be displayed
			if(this._selMarkerBlock) this._selMarkerBlock.parentElement.removeChild(this._selMarkerBlock);//TODO do this only if it will be displayed
			parent = document.body;
		}
	}

	var lineFirstTop = offsetTop + pos1.top;

	this._selMarkerStart.style.display = '';
	this._selMarkerStart.style.top = lineFirstTop + 'px';
	this._selMarkerStart.style.left = offsetLeft + pos1.left + 'px';

	//if length is 0 -> "cursor" representation: add blink-animation
	if(length === 0){
		this._selMarkerStart.classList.add(_cursorBlinkClass);
	} else {
		this._selMarkerStart.classList.remove(_cursorBlinkClass);
	}

	var selHeight = this.setHeightFromFont(elem, this._selMarkerStart);
	if(typeof selHeight === 'undefined'){
		selHeight = getDataInt(this._selMarkerStart, PREV_LINE_HEIGHT);
	} else {
		setData(this._selMarkerStart, PREV_LINE_HEIGHT, selHeight);
	}

	var lines = Math.round(Math.abs(pos1.top - pos2.top) / selHeight) + 1;
	if(lines > 1){

		if(this._debug) console.debug('multiline selections: '+lines);

		//if we have more than 1 line, we can calculate the exact line-height:
		selHeight = Math.abs(pos1.top - pos2.top) / (lines - 1);

		//set marker for first line: from selection-start to line-end
		var lineFirstWidth = elem.clientWidth - pos1.left;//<- NOTE: this marks the complete line (normally only the text would be marked)

		this._selMarkerStart.style.display = '';
		this._selMarkerStart.style.width = lineFirstWidth + 'px';
		this._selMarkerStart.style.height = selHeight + 'px';

		//if there are more than 2 lines, we need an additional block that extends over the complete width
		// and which starts from the lower edge of the first line to the upper edge of the last line
		var lineBlockHeight = (lines - 2) * selHeight;
		if(lineBlockHeight > 0){

			if(!this._selMarkerBlock){
				this._selMarkerBlock = createSelectionMarker(parent? false : offsetParent);
			}

			var lineBlockWidth = elem.clientWidth;

			this._selMarkerBlock.style.display = '';
			this._selMarkerBlock.style.top = lineFirstTop + selHeight + 'px';
			this._selMarkerBlock.style.left = offsetLeft + 'px';
			this._selMarkerBlock.style.width = lineBlockWidth + 'px';
			this._selMarkerBlock.style.height = lineBlockHeight + 'px';
		} else if(this._selMarkerBlock) {
			this._selMarkerBlock.style.display = 'none';
		}

		if(!this._selMarkerEnd){
			this._selMarkerEnd = createSelectionMarker(parent? false : offsetParent);
		}

		//set the marker for the last line: from line-start to the selection-end
		var lineLastWidth = pos2.left;

		this._selMarkerEnd.style.display = '';
		this._selMarkerEnd.style.top = lineFirstTop + selHeight + lineBlockHeight + 'px';
		this._selMarkerEnd.style.left = offsetLeft + 'px';
		this._selMarkerEnd.style.width = lineLastWidth + 'px';
		this._selMarkerEnd.style.height = selHeight + 'px';

	} else {

		//single line selection:

		if(this._selMarkerBlock) this._selMarkerBlock.style.display = 'none';
		if(this._selMarkerEnd) this._selMarkerEnd.style.display = 'none';

		var width = Math.max(1, pos2.left - pos1.left);
		this._selMarkerStart.style.width = width + 'px';

	}

	if(parent){//<- only (re-)insert, if necessary
		parent.appendChild(this._selMarkerStart);
		if(this._selMarkerBlock) parent.appendChild(this._selMarkerBlock);
		if(this._selMarkerEnd) parent.appendChild(this._selMarkerEnd);
	}

  if(target){
    (_selOpt as any)._container = null;
    (_selOpt as any)._fieldName = null;
    _selOpt.text = null;
  }

}

setSelectionColor(color){

	if(color !== _selectionColor){

		_selectionColor = color;

		if(this._selMarkerStart){
			this._selMarkerStart.style.backgroundColor = color;
		}

		if(this._selMarkerEnd){
			this._selMarkerEnd.style.backgroundColor = color;
		}

		if(this._selMarkerBlock){
			this._selMarkerBlock.style.backgroundColor = color;
		}
	}
}

getSelectionColor(){
	return _selectionColor;
}

/**
 * Set options for calculating the selection-marker area.
 *
 * The default settings are
 * 	reuse: true
 * 	guessIfUpdateStyle: true
 *
 * These settings are optimal when text-controls are styled uniformly (font type, font size etc).
 * If text-controls are styled differently, <code>guessIfUpdateStyle</code> should be set to false, or
 * {@link #resetStyleCaretCoordinatesDiv} should be invoked when a new (differently styled) text control
 * gets selected.
 *
 * @param {PlainObject} options
 * 				options for calculating the caret (selection area) coordinates:
 * 				options.reuse				BOOLEAN: reuse shadow DIV that is used for calculating the caret coordinates (DEFAULT: true)
 * 				options.guessIfUpdateStyle	BOOLEAN | FUNCTION: if TRUE, styling of the shadow DIV is not updated, if the current target element has the same type (Tag Name) as the previous one.
 * 																If function: a callback for determining, if the shadow DIV's style should be updated (return TRUE, if it shoud get updated): callback(shadowDiv) : BOOLEAN
 * 																NOTE this option is only relevant, if "reuse" is TRUE.
 * 																(DEFAULT: true)
 * 				options.forceUpdateStyle	BOOLEAN: force updating the style of the shadow DIV; only relevant, if "reuse" is TRUE (DEFAULT: false)
 * 				options.id					STRING: the id attribute for the shadow DIV (DEFAULT: "input-textarea-caret-position-mirror-div")
 */
setSelectionOptions(options){
	_selOpt = options;
}

getSelectionOptions(): SelectionOptions {
	return _selOpt;
}

/**
 * Manually reset the shadow DIV that is used for calculating the selection-marker area.
 *
 * This can be used, when <code>options.reuse = true</code> and the style of the target text-control (input or texarea) has
 * changed (in comparison to the last one, for which the selection-marker was calculated).
 *
 * If <code>options.reuse = false</code>, the shadow DIV is always reset, before calculating the area for the selection-marker,
 * i.e. no resetting necessary.
 */
resetSelectionCalc(){
	this.caretPos.resetStyleDiv();
}


setHeightFromFont(elem, marker){

	var fontSize = getComputedStyle(elem).getPropertyValue('font-size');

	//check if (re-)calculation of font-size is necessary:
	var prevFontSize = getData(marker, PREV_FONT_SIZE);
	if(fontSize === prevFontSize){
		return;///////// EARLY EXIT ////////////////
	}

	var pxSize = this.unitUtil.toPx(elem, fontSize);

	var lineHeight = getComputedStyle(elem).getPropertyValue('line-height');
	if(lineHeight === 'normal'){
		//FIXME: the 'normal' line-height is slightly greater than the font-size
		//       ... this approximates the increase in webkit-based engine ... is there a formula for this?
		pxSize += Math.round(pxSize * 0.17);
	} else {
		pxSize = this.unitUtil.toPx(elem, lineHeight, 'line-height');
	}

	marker.style.height = pxSize + 'px';
	setData(marker, PREV_FONT_SIZE, fontSize);//<- store un-modified fontSize

	return pxSize;
}

}

/**
 * Stores data as String to the HTMLElement
 *
 * @param {HTMLElement} el
 * @param {String} name
 * 			the key for storing the data
 * @param {Number|Boolean|String} value
 * 			the value to be stored as String (primitive types will be automatically converted to String)
 *
 */
function setData(el, name, value){
	el.dataset[name] = value;
}

/**
 * Get data as String from the HTMLElement
 *
 * @param {HTMLElement} el
 * @param {String} name
 * 			the key for retrieving the data
 * @returns {String}
 */
function getData(el, name){
	return el.dataset[name];
}

/**
 * Get data as a Number (integer) from the HTMLElement
 *
 * @param {HTMLElement} el
 * @param {String} name
 * 			the key for retrieving the data
 * @returns {Number} the data as integer. If conversion fails, NaN will be returned (e.g. check with isFinite()).
 */
function getDataInt(el, name){
	return parseInt(el.dataset[name], 10);
}

/**
 * Get data as a Boolean from the HTMLElement
 *
 * @param {HTMLElement} el
 * @param {String} name
 * 			the key for retrieving the data
 * @returns {Boolean} TRUE if the data is "true", otherwise FALSE.
 */
function getDataBool(el, name){
	return el.dataset[name] === 'true';
}
