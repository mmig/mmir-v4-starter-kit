
define(
/**
 * Returns a module/factory for creating microphone-renderers
 * 
 * @class mmir.starterkit.render
 * 
 * @example
 * 
 *  require(['apprenderer'], function(factory){
 *  	
 *  	var canvas = document.getElementById('c');
 *  	var renderer = factory.createMicRenderer(canvas)
 *  	
 *  	renderer.draw(2);	
 *  });
 *  
 */
function(){

/**
 * Creates / initializes the renderer
 * 
 * @param {Canvas} [canvasEl]
 * 				the DOM Canvas element on which the renderer will paint
 * @param {RenderOptions} [opt]
 * 				options (colors) for rendering
 * 
 * @return {Renderer} a renderer with functions
 * 			<code>draw(ampl : INTEGER)</code>
 * 			<code>set(canvas : DOM_CANVAS)</code>
 * 
 * @memberOf mmir.starterkit.render.impl
 * 
 * @example
 * 
 *  var canvas = document.getElementById('c');
 *  
 *  //NOTE these are actually the default colors!
 *  var options = {
 *		color: {
 *			//colors for level 1 (active / inactive)
 *			1: {
 *				on: '#116611',
 *				off: '#676666'
 *			},
 *			//colors for level 2
 *			2: {
 *				on: '#2D882D',
 *				off: '#969696'
 *			},
 *			//colors for level 3
 *			3: {
 *				on: '#55AA55',
 *				off: '#C1C1C1'
 *			},
 *			//colors for level 4
 *			4: {
 *				on: '#88CC88',
 *				off: '#E9E9E9'
 *			},
 *			//color for the microphone symbol
 *			micro: '#4f4c4d'
 *		}
 *	};
 *
 *  var renderer =  createRenderer(canvas, options);
 *  renderer.draw(2);
 */
function createRenderer(canvasEl, opt){

/**
 * original height of the vector graphic (for scaling to canvas size)
 * 
 * @memberOf mmir.starterkit.render.impl
 */
var ch = 67.22012976377954;
/**
 * original width of the vector graphic (for scaling to canvas size)
 * 
 * @memberOf mmir.starterkit.render.impl
 */
var cw = 67.12133291338583;

/**
 * the value of the previous amplitude that was rendered
 * 
 * @type Number
 * @memberOf mmir.starterkit.render.impl
 */
var lastAmpl;

/**
 * the options that will be used for rendering
 * 
 * @type RenderingOptions
 * @memberOf mmir.starterkit.render.impl
 */
var options = {
	color: {
		//colors for level 1 (active / inactive)
		1: {
			on: '#116611',
			off: '#676666'
		},
		//colors for level 2
		2: {
			on: '#2D882D',
			off: '#969696'
		},
		//colors for level 3
		3: {
			on: '#55AA55',
			off: '#C1C1C1'
		},
		//colors for level 4
		4: {
			on: '#88CC88',
			off: '#E9E9E9'
		},
		micro: '#4f4c4d'
			
	}
};


//shift arguments, if necessary:
if(canvasEl && !opt){
	
	//test & set options, if they were supplied:
	if(_setOptions(canvasEl)){
		//canvasEl was actually the options -> shift arguments
		opt = canvasEl;
		canvasEl = void(0);
	}
}

/**
 * The DOMElement Canvas on which the renderer will paint
 * 
 * @type Canvas
 * @memberOf mmir.starterkit.render.impl
 */
var canvas = _getCanvas(canvasEl);

/**
 * Set rendering options.
 * 
 * Supported options:
 * {
 * 	color: {
 * 		//colors for rendering levels 1 - 4
 * 		1: {on: STRING html color code, off: STRING html color code},
 * 		2: {on: STRING html color code, off: STRING html color code},
 * 		3: {on: STRING html color code, off: STRING html color code},
 * 		4: {on: STRING html color code, off: STRING html color code}, 
 * 	}
 * }
 * 
 * @param {RenderingOptions} [opt]
 * 				if opt is FALSY, it will be ignored
 * 
 * @returns {Boolean} <code>true</code> if <code>opt</code> is a valid options object
 * 					  (and its options were applied)
 * 
 * @memberOf mmir.starterkit.render.impl
 */
function _setOptions(opt){

	var isOptions = false;
	
	if(opt){
		
		if(opt.color){
			
			for(var i in opt.color){
				if(opt.color.hasOwnProperty(i)){
					
					if(typeof options.color[i] === 'string'){
						
						options.color[i] = opt.color[i];
					} else {
						
						for(var j in opt.color[i]){
							if(opt.color[i].hasOwnProperty(j)){
								
								if(options.color[i]){
									isOptions = true;
									options.color[i][j] = opt.color[i][j];
								}
							}
						}
					}
					
				}//END: if( hasOwnProperty(i) )
			}//END: for( i in opt.color)
			
			
		}//END: if( opt.color )
	}//END: if( opt )
	
	return isOptions;
}

/**
 * get the color for the circle at index i
 * 
 * @memberOf mmir.starterkit.render.impl
 */
function _getColor(i, isActive){
	
	var colSel = isActive? 'on' : 'off';
	if(i < 1){
		i = 1;
	} else if(i > 4){
		i = 4;
	}
	
	return options.color[i][colSel];
}

/**
 * HELPER normalize canvas argument
 * 
 * @memberOf mmir.starterkit.render.impl
 */
function _getCanvas(canvasEl){
	
	if(!canvasEl){
		return canvasEl;
	}
	
	if(typeof canvasEl.jquery === 'string'){
		return canvasEl[0];
	}
	
	return canvasEl;
}

/**
 * @param {Integer} ampl
 * 			the amplitude, an integer between 0 and 4
 * 
 * @param {Canvas} [canvasEl] OPTIONAL
 * 			if not provided, the preset canvas element will be used
 * 
 * @param {Boolean} [isForce] OPTIONAL
 * 			force drawing, even if ampl is same value as in the last invocation
 * 
 * @memberOf mmir.starterkit.render.impl
 */
function _draw(ampl, canvasEl, isForce) {

	if(ampl === lastAmpl && isForce !== true){
		return;
	}
	
	canvasEl = _getCanvas(canvasEl);
	
	var cEl = canvasEl? canvasEl : canvas;
	
	var h = cEl.height;
	var w = cEl.width;
	
	var ctx = cEl.getContext('2d');
	ctx.save();
	
	ctx.globalCompositeOperation = 'source-over';

	ctx.clearRect(0, 0, w, h);

	var h2 = h/ch;
	var w2 = w/cw;
	var offsetx2 = 0;
	var offsety2 = 0;
	
	//calculate scaling & offset-adjustment for centering
	var scale;
	if(h2 > w2){
		scale = w2;
		offsety2 = (h/scale - ch) / 2;
	} else {
		scale = h2;
		offsetx2 = (w/scale - cw) / 2;
	}
	
	//console.log(scale+ ' h '+h+ ' w '+w+ ' h2 '+h2+ ' w2 '+w2+ ' ch '+ch+ ' cw '+cw+ ' offsetx2 '+offsetx2+ ' offsety2 '+offsety2);
  
	ctx.scale(scale,scale);
	
	if(offsetx2 || offsety2){
		ctx.translate(offsetx2,offsety2);
	}
	
	_render(ctx, ampl);
	lastAmpl = ampl;
	
	ctx.restore();
}

/**
 * 
 * @param {Context2d} ctx
 * @param {Integer} ampl
 * 					amplitude, an integer between 0 and 4, i.e. from intervall [0, 4]
 * 
 * @memberOf mmir.starterkit.render.impl
 */
function _render(ctx, ampl) {

ctx.save();
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(67.12133291338583,0);
ctx.lineTo(67.12133291338583,67.22012976377954);
ctx.lineTo(0,67.22012976377954);
ctx.closePath();
ctx.clip();
ctx.translate(0,2.472089732918903e-8);
ctx.scale(1.0666666769440816,1.0666666769440816);
ctx.translate(0,0);
ctx.strokeStyle = 'rgba(0,0,0,0)';
ctx.lineCap = 'butt';
ctx.lineJoin = 'miter';
ctx.miterLimit = 4;
ctx.save();
ctx.restore();
ctx.save();
ctx.translate(-314.51516,-134.47573);
ctx.save();
ctx.transform(1.25,0,0,-1.25,43.856789,867.26273);
ctx.save();
ctx.beginPath();
ctx.moveTo(0,841.89);
ctx.lineTo(595.276,841.89);
ctx.lineTo(595.276,0);
ctx.lineTo(0,0);
ctx.lineTo(0,841.89);
ctx.closePath();
ctx.clip();
ctx.save();
ctx.translate(269.3706,561.0596);
ctx.restore();
ctx.save();
ctx.translate(269.3706,561.0596);
ctx.restore();
ctx.save();

//4th circle: ampl >= 4
ctx.translate(266.6177,561.0596);
ctx.save();
ctx.fillStyle = _getColor(4, ampl >= 4);
ctx.strokeStyle = "rgba(0, 0, 0, 0)";
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-13.763,-11.157,-24.92,-24.92,-24.92);
ctx.bezierCurveTo(-38.684,-24.92,-49.841,-13.763000000000002,-49.841,0);
ctx.bezierCurveTo(-49.841,13.763,-38.684,24.92,-24.92,24.92);
ctx.bezierCurveTo(-11.157,24.92,0,13.763,0,0);
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();
ctx.translate(266.6177,561.0596);
ctx.save();
ctx.fillStyle = "rgba(0, 0, 0, 0)";
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 0.5;
ctx.lineCap = "butt";
ctx.lineJoin = "miter";
ctx.miterLimit = 10;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-13.763,-11.157,-24.92,-24.92,-24.92);
ctx.bezierCurveTo(-38.684,-24.92,-49.841,-13.763000000000002,-49.841,0);
ctx.bezierCurveTo(-49.841,13.763,-38.684,24.92,-24.92,24.92);
ctx.bezierCurveTo(-11.157,24.92,0,13.763,0,0);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();

//3rd circle: ampl >= 3
ctx.translate(262.8535,561.0596);
ctx.save();
ctx.fillStyle = _getColor(3, ampl >= 3);
ctx.strokeStyle = "rgba(0, 0, 0, 0)";
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-11.685,-9.472,-21.157,-21.156,-21.157);
ctx.bezierCurveTo(-32.841,-21.157,-42.313,-11.685,-42.313,0);
ctx.bezierCurveTo(-42.313,11.685,-32.841,21.156,-21.156000000000002,21.156);
ctx.bezierCurveTo(-9.472,21.156,0,11.685,0,0);
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();
ctx.translate(262.8535,561.0596);
ctx.save();
ctx.fillStyle = "rgba(0, 0, 0, 0)";
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 0.5;
ctx.lineCap = "butt";
ctx.lineJoin = "miter";
ctx.miterLimit = 10;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-11.685,-9.472,-21.157,-21.156,-21.157);
ctx.bezierCurveTo(-32.841,-21.157,-42.313,-11.685,-42.313,0);
ctx.bezierCurveTo(-42.313,11.685,-32.841,21.156,-21.156000000000002,21.156);
ctx.bezierCurveTo(-9.472,21.156,0,11.685,0,0);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();

//2nd (2nd smallest circle): ampl >= 2
ctx.translate(259.3071,561.0596);
ctx.save();
ctx.fillStyle = _getColor(2, ampl >= 2);
ctx.strokeStyle = "rgba(0, 0, 0, 0)";
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-9.726,-7.884,-17.61,-17.61,-17.61);
ctx.bezierCurveTo(-27.335,-17.61,-35.22,-9.725999999999999,-35.22,0);
ctx.bezierCurveTo(-35.22,9.726,-27.335,17.61,-17.61,17.61);
ctx.bezierCurveTo(-7.884,17.61,0,9.726,0,0);
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();
ctx.translate(259.3071,561.0596);
ctx.save();
ctx.fillStyle = "rgba(0, 0, 0, 0)";
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 0.5;
ctx.lineCap = "butt";
ctx.lineJoin = "miter";
ctx.miterLimit = 10;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-9.726,-7.884,-17.61,-17.61,-17.61);
ctx.bezierCurveTo(-27.335,-17.61,-35.22,-9.725999999999999,-35.22,0);
ctx.bezierCurveTo(-35.22,9.726,-27.335,17.61,-17.61,17.61);
ctx.bezierCurveTo(-7.884,17.61,0,9.726,0,0);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();

//1st (smallest) circle: ampl >= 1
ctx.translate(255.2852,561.0596);
ctx.save();
ctx.fillStyle = _getColor(1, ampl >= 1);
ctx.strokeStyle = "rgba(0, 0, 0, 0)";
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-7.504,-6.083,-13.588,-13.588,-13.588);
ctx.bezierCurveTo(-21.092,-13.588,-27.176,-7.504,-27.176,0);
ctx.bezierCurveTo(-27.176,7.504,-21.092,13.588,-13.588,13.588);
ctx.bezierCurveTo(-6.083,13.588,0,7.504,0,0);
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();
ctx.translate(255.2852,561.0596);
ctx.save();
ctx.fillStyle = "rgba(0, 0, 0, 0)";
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 0.5;
ctx.lineCap = "butt";
ctx.lineJoin = "miter";
ctx.miterLimit = 10;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-7.504,-6.083,-13.588,-13.588,-13.588);
ctx.bezierCurveTo(-21.092,-13.588,-27.176,-7.504,-27.176,0);
ctx.bezierCurveTo(-27.176,7.504,-21.092,13.588,-13.588,13.588);
ctx.bezierCurveTo(-6.083,13.588,0,7.504,0,0);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();
ctx.translate(251.6553,561.0596);
ctx.save();
ctx.fillStyle = "#ffffff";
ctx.strokeStyle = "rgba(0, 0, 0, 0)";
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-5.5,-4.458,-9.958,-9.958,-9.958);
ctx.bezierCurveTo(-15.458,-9.958,-19.916,-5.5,-19.916,0);
ctx.bezierCurveTo(-19.916,5.5,-15.458,9.958,-9.958,9.958);
ctx.bezierCurveTo(-4.458,9.958,0,5.5,0,0);
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();
ctx.translate(251.6553,561.0596);
ctx.save();
ctx.fillStyle = "rgba(0, 0, 0, 0)";
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 0.5;
ctx.lineCap = "butt";
ctx.lineJoin = "miter";
ctx.miterLimit = 10;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-5.5,-4.458,-9.958,-9.958,-9.958);
ctx.bezierCurveTo(-15.458,-9.958,-19.916,-5.5,-19.916,0);
ctx.bezierCurveTo(-19.916,5.5,-15.458,9.958,-9.958,9.958);
ctx.bezierCurveTo(-4.458,9.958,0,5.5,0,0);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();
ctx.translate(235.4277,550.0728);
ctx.save();
ctx.fillStyle = options.color.micro;
ctx.strokeStyle = "rgba(0, 0, 0, 0)";
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0,-3.448,2.718,-6.253,6.059,-6.253);
ctx.bezierCurveTo(9.399000000000001,-6.253,12.117,-3.448,12.117,0);
ctx.lineTo(12.117,3.659);
ctx.lineTo(11.837000000000002,3.659);
ctx.lineTo(11.837000000000002,1.9849999999999999);
ctx.bezierCurveTo(11.837000000000002,-2.374,9.245000000000001,-5.92,6.058000000000002,-5.92);
ctx.bezierCurveTo(2.8710000000000018,-5.92,0.27800000000000136,-2.374,0.27800000000000136,1.9850000000000003);
ctx.lineTo(0.27800000000000136,3.6590000000000003);
ctx.lineTo(0,3.659);
ctx.lineTo(0,0);
ctx.closePath();
ctx.moveTo(1.286,-13.758);
ctx.lineTo(1.286,-11.451999999999998);
ctx.lineTo(4.905,-11.451999999999998);
ctx.lineTo(4.905,-8.470999999999998);
ctx.bezierCurveTo(0.825,-7.889,-2.307,-4.256,-2.307,0);
ctx.lineTo(-2.307,5.964);
ctx.lineTo(0.278,5.964);
ctx.lineTo(0.278,8.836);
ctx.bezierCurveTo(0.278,13.195,2.871,16.742,6.058,16.742);
ctx.bezierCurveTo(9.245,16.742,11.837,13.195,11.837,8.836000000000002);
ctx.lineTo(11.837,5.964000000000002);
ctx.lineTo(14.423,5.964000000000002);
ctx.lineTo(14.423,1.7763568394002505e-15);
ctx.bezierCurveTo(14.423,-4.2559999999999985,11.292,-7.8889999999999985,7.212,-8.470999999999998);
ctx.lineTo(7.212,-11.451999999999998);
ctx.lineTo(10.885,-11.451999999999998);
ctx.lineTo(10.885,-13.758);
ctx.lineTo(1.2859999999999996,-13.758);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.save();
ctx.translate(241.4854,567.3145);
ctx.save();
ctx.fillStyle = "#ffffff";
ctx.strokeStyle = "rgba(0, 0, 0, 0)";
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(-3.462,0,-6.279,-3.771,-6.279,-8.405);
ctx.lineTo(-6.279,-10.777);
ctx.lineTo(-7.864,-10.777);
ctx.lineTo(-8.864,-10.777);
ctx.lineTo(-8.864,-11.777);
ctx.lineTo(-8.864,-17.241999999999997);
ctx.bezierCurveTo(-8.864,-21.595999999999997,-5.764000000000001,-25.333,-1.6530000000000005,-26.134999999999998);
ctx.lineTo(-1.6530000000000005,-28.194);
ctx.lineTo(-4.272,-28.194);
ctx.lineTo(-5.272,-28.194);
ctx.lineTo(-5.272,-29.194);
ctx.lineTo(-5.272,-30.5);
ctx.lineTo(-5.272,-31.5);
ctx.lineTo(-4.272,-31.5);
ctx.lineTo(4.327,-31.5);
ctx.lineTo(5.327,-31.5);
ctx.lineTo(5.327,-30.5);
ctx.lineTo(5.327,-29.194);
ctx.lineTo(5.327,-28.194);
ctx.lineTo(4.327,-28.194);
ctx.lineTo(1.654,-28.194);
ctx.lineTo(1.654,-26.134999999999998);
ctx.bezierCurveTo(5.765,-25.333,8.866,-21.595999999999997,8.866,-17.241999999999997);
ctx.lineTo(8.866,-11.776999999999997);
ctx.lineTo(8.866,-10.776999999999997);
ctx.lineTo(7.866,-10.776999999999997);
ctx.lineTo(6.279999999999999,-10.776999999999997);
ctx.lineTo(6.279999999999999,-8.404999999999998);
ctx.bezierCurveTo(6.28,-3.771,3.463,0,0,0);
ctx.moveTo(0,-22.662);
ctx.bezierCurveTo(-2.903,-22.662,-5.279,-19.329,-5.279,-15.256999999999998);
ctx.lineTo(-5.279,-13.082999999999998);
ctx.lineTo(-6.558,-13.082999999999998);
ctx.lineTo(-6.558,-17.241999999999997);
ctx.bezierCurveTo(-6.558,-20.964999999999996,-3.6149999999999998,-23.994999999999997,0.001000000000000334,-23.994999999999997);
ctx.bezierCurveTo(3.6170000000000004,-23.994999999999997,6.559,-20.964999999999996,6.559,-17.241999999999997);
ctx.lineTo(6.559,-13.082999999999998);
ctx.lineTo(5.28,-13.082999999999998);
ctx.lineTo(5.28,-15.256999999999998);
ctx.bezierCurveTo(5.28,-19.328999999999997,2.9040000000000004,-22.662,0,-22.662);
ctx.moveTo(0,-1);
ctx.bezierCurveTo(2.904,-1,5.28,-4.333,5.28,-8.405000000000001);
ctx.lineTo(5.28,-11.777000000000001);
ctx.lineTo(7.866,-11.777000000000001);
ctx.lineTo(7.866,-17.242);
ctx.bezierCurveTo(7.866,-21.459,4.686,-24.924,0.6539999999999999,-25.266);
ctx.lineTo(0.6539999999999999,-29.194);
ctx.lineTo(4.327,-29.194);
ctx.lineTo(4.327,-30.5);
ctx.lineTo(-4.272,-30.5);
ctx.lineTo(-4.272,-29.194);
ctx.lineTo(-0.653,-29.194);
ctx.lineTo(-0.653,-25.266);
ctx.bezierCurveTo(-4.6850000000000005,-24.924,-7.864000000000001,-21.459,-7.864000000000001,-17.241999999999997);
ctx.lineTo(-7.864000000000001,-11.776999999999997);
ctx.lineTo(-5.279000000000001,-11.776999999999997);
ctx.lineTo(-5.279000000000001,-8.404999999999998);
ctx.bezierCurveTo(-5.279,-4.333,-2.903,-1,0,-1);
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.restore();
ctx.restore();
ctx.restore();
ctx.restore();
ctx.restore();
}

return {
	/** @memberOf mmir.starterkit.renderer */
	draw: _draw,
	/** @memberOf mmir.starterkit.renderer */
	set: function(cvsEl, options){
		_setOptions(options);
		canvas = _getCanvas(cvsEl);
	}
};

};//END: createRenderer()


//export public module functions:
return {
	/**
	 * @memberOf mmir.starterkit.render
	 */
	createMicRenderer: createRenderer
};

});