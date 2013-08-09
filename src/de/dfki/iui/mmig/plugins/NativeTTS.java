/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2011, IBM Corporation
 */

package de.dfki.iui.mmig.plugins;

import java.util.HashMap;
import java.util.Locale;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.speech.tts.TextToSpeech;
import android.speech.tts.TextToSpeech.OnInitListener;
import android.speech.tts.TextToSpeech.OnUtteranceCompletedListener;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;

public class NativeTTS extends CordovaPlugin {

	// private static final String LOG_TAG = "TTS";
	private static final int STOPPED = 0;
	private static final int INITIALIZING = 1;
	private static final int STARTED = 2;
	private TextToSpeech mTts = null;
	private int state = STOPPED;
	
	private boolean isSpeaking = false;

//	private String startupCallbackId = "";

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
		
		boolean isValidAction = true;
		PluginResult result = null;

		//TODO parameterize language/Locale setting
		//TODO replace System.out with Log.i etc.
		
		try {
			if (action.equals("speak")) {
				String text = args.getString(0);
//				mTts.setLanguage(Locale.US);
				if (isReady()) {
					//TODO for now, always stop current TTS (if there is one active), before starting a new one
					//		--> "singleton" TTS
					//TODO keep using instance of SpeechCompletedListener + map [utteranceId]->[callbackContext], then 
					//			(1) notify accordingly in SpeechCompletedListener.onUtteranceCompleted(utteranceId)...
					//			(2) remove entry in map, when speech has completed
					//		-> impl. similar/extended UtteranceProgressListener for API level >= 15
					if(isSpeaking){
						mTts.stop();
					}
					mTts.setOnUtteranceCompletedListener(new SpeechCompletedListener(callbackContext));
					isSpeaking = true;//"singleton" signifier for TTS-active; reset in onUtteranceComleted of listener
					
					//create utterance ID (for now always the same ID is used --> "singleton" TTS, see above)
					String constUtteranceId = "google-tts";
					HashMap<String, String> params = new HashMap<String, String>();
					params.put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, constUtteranceId);
					int ttsResult;
					Exception error = null;
					try {
						ttsResult = mTts.speak(text, TextToSpeech.QUEUE_FLUSH, params);//TODO: should this be QUEUE_ADD? configurable/parameterized?
						if(ttsResult == TextToSpeech.SUCCESS){
							//TODO signal "started" for onStart callback in API level < 15
							result =  new PluginResult(PluginResult.Status.NO_RESULT);
							result.setKeepCallback(true);
						}
					} catch(Exception e){
						error = e;
						ttsResult = TextToSpeech.ERROR;
					}
					
					if(ttsResult == TextToSpeech.ERROR){
						result = new PluginResult(PluginResult.Status.ERROR, error.toString());//TODO include error's stacktrace?
					}
					
				} else {
					JSONObject error = new JSONObject();
					error.put("message", "TTS service is still initialzing.");
					error.put("code", NativeTTS.INITIALIZING);
					result =  new PluginResult(PluginResult.Status.ERROR, error);
				}
			} else if (action.equals("silence")) {
				if (isReady()) {
					mTts.playSilence(args.getLong(0), TextToSpeech.QUEUE_ADD, null);
					result =  new PluginResult(PluginResult.Status.OK);
				} else {
					JSONObject error = new JSONObject();
					error.put("message", "TTS service is still initialzing.");
					error.put("code", NativeTTS.INITIALIZING);
					result = new PluginResult(PluginResult.Status.ERROR, error);
				}
			} else if (action.equals("startup")) {
				if (mTts == null) {
//					this.startupCallbackId = callbackId;
					state = NativeTTS.INITIALIZING;
//					mTts = new TextToSpeech(ctx.getContext(), this);
					mTts = new TextToSpeech(this.cordova.getActivity(), new TTSInitListener(callbackContext));
					// mTts.setLanguage(Locale.US);
					System.out.println("test");
				}
				result =  new PluginResult(PluginResult.Status.OK, NativeTTS.INITIALIZING);
				result.setKeepCallback(true);
			} else if (action.equals("shutdown")) {
				if (mTts != null) {
					mTts.shutdown();
				}
				result = new PluginResult(PluginResult.Status.OK);
			} else if (action.equals("getLanguage")) {
				if (mTts != null) {
					result =   new PluginResult(PluginResult.Status.OK, mTts.getLanguage().toString());
				}
			} else if (action.equals("isLanguageAvailable")) {
				if (mTts != null) {
					Locale loc = new Locale(args.getString(0));
					int available = mTts.isLanguageAvailable(loc);
					result = new PluginResult(PluginResult.Status.OK, (available < 0) ? "false" : "true");
				}
			} else if (action.equals("setLanguage")) {
				if (mTts != null) {
					Locale loc = new Locale(args.getString(0));
					int available = mTts.setLanguage(loc);
					result =   new PluginResult(PluginResult.Status.OK, (available < 0) ? "false" : "true");
				}
			}
			else if (action.equals("cancel")) {
				if (mTts != null && isReady()) {
					int cancelResult = mTts.stop();
					result =  new PluginResult(PluginResult.Status.OK, cancelResult == TextToSpeech.SUCCESS? "stopped" : "failed");//TODO in case of ERROR return status.error
				} if (mTts != null && !isReady()) {
					result =  new PluginResult(PluginResult.Status.OK, "Cancel: cannot cancel TTS (engine not initialized yet).");
				} else {
					JSONObject error = new JSONObject();
					//TODO create appropriate message ...
					error.put("message", "TTS service is still initialzing.");
					error.put("code", NativeTTS.INITIALIZING);
					result = new PluginResult(PluginResult.Status.ERROR, error);
				}
			}
			else {
				isValidAction = false;
			}
		} catch (JSONException e) {
			e.printStackTrace();
			result =  new PluginResult(PluginResult.Status.JSON_EXCEPTION);
		}
		
		callbackContext.sendPluginResult(result);
		
		return isValidAction;
	}

	/**
	 * Is the TTS service ready to play yet?
	 * 
	 * @return
	 */
	private boolean isReady() {
		return (state == NativeTTS.STARTED) ? true : false;
	}

	
	private class TTSInitListener  implements OnInitListener {
		
		private CallbackContext callbackContext;
		public TTSInitListener(CallbackContext callbackContext){
			this.callbackContext = callbackContext;
		}
		/**
		 * Called when the TTS service is initialized.
		 * 
		 * @param status
		 */
		@Override
		public void onInit(int status) {
			if (status == TextToSpeech.SUCCESS) {
				state = NativeTTS.STARTED;
				//TODO implement / activate this for CALLBACK onStart (when supported by javascript interface)
				PluginResult result = new PluginResult(PluginResult.Status.OK, NativeTTS.STARTED);
				result.setKeepCallback(false);
//				this.success(result, this.startupCallbackId);
				this.callbackContext.sendPluginResult(result);
			} else if (status == TextToSpeech.ERROR) {
				state = NativeTTS.STOPPED;
				PluginResult result = new PluginResult(PluginResult.Status.ERROR, NativeTTS.STOPPED);
				result.setKeepCallback(false);
//				this.error(result, this.startupCallbackId);
				this.callbackContext.sendPluginResult(result);
			}
		}
	}
	
//	//TODO implement UtteranceProgressListener (note: requires API level >= 15)
//	private class TTSListener implements UtteranceProgressListener {
//		
//	}
	
	private class SpeechCompletedListener implements OnUtteranceCompletedListener {
		
		private CallbackContext callbackContext;
		public SpeechCompletedListener(CallbackContext callbackContext){
			this.callbackContext = callbackContext;
		}
		
		@Override
		public void onUtteranceCompleted(String utteranceId) {
			isSpeaking = false;
			//TODO implement / activate this for CALLBACK onStart (when supported by javascript interface)
			PluginResult result = new PluginResult(PluginResult.Status.OK, "Speech (id "+utteranceId+") completed.");
			result.setKeepCallback(false);
//			this.success(result, this.startupCallbackId);
			this.callbackContext.sendPluginResult(result);
		}
		
	}

	/**
	 * Clean up the TTS resources
	 */
	@Override
	public void onDestroy() {
		if (mTts != null) {
			mTts.shutdown();
		}
	}
}
