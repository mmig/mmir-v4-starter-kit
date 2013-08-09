package de.dfki.iui.mmig.plugins;

/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;

import de.dfki.iui.mmig.R;

import android.media.MediaPlayer;

/**
 * Triggers a beep sound
 * (custom beep sound, i.e. a WAV file at /res/raw is used for this).
 * 
 * @author russa
 *
 */
public class BeepPlugin extends CordovaPlugin {
	
	private MediaPlayer soundPlayer;
	private float volume;

    public BeepPlugin() {
    }

    @Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
		
    	//TODO support for Float volume setting/argument
		if (action.equals("beep")) {
			
	    	createSoundPlayer();
			
			if(soundPlayer.isPlaying())
				soundPlayer.stop();
			
			soundPlayer.start();
			
			callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, "done"));
		}
		else if (action.equals("setVolume")) {
			
	    	createSoundPlayer();
	    	
			try {
				volume = (float) args.getDouble(0);
				
				soundPlayer.setVolume(volume, volume);
				
				callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, "done"));
				
			} catch (JSONException e) {
				try {
					callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.ERROR, "invalid argument (expected FLOAT): "+ args.get(0) ));
				} catch (JSONException e1) {
					callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.ERROR, "missing argument (expected FLOAT)" ));
				}
			}
		}
		else if (action.equals("getVolume")) {
			
	    	createSoundPlayer();
	    	
	    	callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, volume));
		}
		else {
			callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.INVALID_ACTION));
		}
		
		return true;
	}

	@Override
	public void onPause(boolean multitasking) {
		releaseSoundPlayer();
		super.onPause(multitasking);
	}

	@Override
	public void onDestroy() {
		releaseSoundPlayer();
		super.onDestroy();
	}
    
    private void createSoundPlayer(){
    	if(soundPlayer == null){
    		soundPlayer = MediaPlayer.create(this.cordova.getActivity(), R.raw.beep);
    		volume = 1f;
    	}
    }
    
    private void releaseSoundPlayer(){
    	this.soundPlayer.release();
    	this.soundPlayer = null;
    }
}

