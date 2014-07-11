/*
 * Phonegap VolumeControl Plugin for Android
 * Cordova 2.2.0
 * Email: manusimpson[at]gmail[dot]com
 * Author: Manuel Simpson
 * Date: 12/28/2012
 */
function VolumeControl(){}

var VolumeControl = {
  setVolume: function(vol, successCallback, failureCallback){
	  
	  var args;
	  if(typeof vol === 'object'){
		  args = [vol.level,vol.mode,vol.volume];
	  }
	  else {
		  args = [vol];
	  }
	  
		return cordova.exec(
			successCallback,
			failureCallback,
			'VolumeControl',
			'setVolume',
			args
		);
	},
	getVolume: function(successCallback,failureCallback){
		return cordova.exec(
			successCallback,
			failureCallback,
			'VolumeControl',
			'getVolume',
			[]);
	},
	onVolumeChange: function(successCallback,failureCallback){
		return cordova.exec(
			successCallback,
			failureCallback,
			'VolumeControl',
			'onVolumeChange',
			[]);
	}
};
