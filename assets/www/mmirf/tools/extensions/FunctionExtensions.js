

//add 'bind' function to Function-objects, if there is no native support present:
//
// (NOTE: this functionality is required by scion.js)
if (!Function.prototype.bind) {

	/*
	 * Code is taken from
	 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
	 * 
	 */
	Function.prototype.bind = function(oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError(
					"Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
		}, fBound = function() {
			return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
					aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}