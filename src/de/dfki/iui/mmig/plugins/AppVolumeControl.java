/*
 * based on:
 * 
 * Phonegap VolumeControl Plugin for Android
 * Cordova 2.2.0
 * Author: Manuel Simpson
 * Email: manusimpson[at]gmail[dot]com
 * Date: 12/28/2012
 * 
 */
package de.dfki.iui.mmig.plugins;

import java.util.ArrayList;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.LOG;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.SharedPreferences;
import android.database.ContentObserver;
import android.media.AudioManager;
import android.os.Handler;
import android.util.Log;


public class AppVolumeControl extends CordovaPlugin {//VolumeControl {
	
	////////////////////////// original VolumeControl code: /////////////////////////////////////

	public static final String SET = "setVolume";
	public static final String GET = "getVolume";
	public static final String ON = "onVolumeChange";
//	//TODO implement un-register
//	public static final String OFF = "offVolumeChange";
	protected Context context;
	protected AudioManager manager;
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		boolean actionState = true;
		context = cordova.getActivity().getApplicationContext();
//		manager = (AudioManager)context.getSystemService(Context.AUDIO_SERVICE);
		init();
		if (SET.equals(action)) {
			
			try {
			
				//Get the volume value to set
				int volume = getAsRawVolume(args.getInt(0));
								
				//Set the volume
//				manager.setStreamVolume(AudioManager.STREAM_MUSIC, volume, AudioManager.FLAG_PLAY_SOUND);
				setRawVolume(volume);
				
				callbackContext.success();
			} catch (Exception e) {
				LOG.d("VolumeControl", "Error setting volume " + e);
				actionState = false;
			}
		} else if(GET.equals(action)){
				//Get current system volume
				int currVol = getCurrentVolume();
				String strVol= String.valueOf(currVol);
				callbackContext.success(strVol);
				LOG.d("VolumeControl", "Current Volume is " + currVol);
		} else if(ON.equals(action)){
			
			this.addListener(callbackContext);
			
		} else {
			actionState = false;
		}
		return actionState;
	}
	
	/**
	 * Convert percent-value to absolute volume setting (i.e. "raw" setting of this device).
	 * 
	 * @param percent	value as percent
	 * @return the raw int volume setting
	 */
	protected int getAsRawVolume(int percent){
		int volLevel;
		int maxVolume = manager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
		volLevel = Math.round((percent * maxVolume) / 100);

		return volLevel;
	}
	
	protected int getAsPercentVolume(int raw){
		int maxVolume = manager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
		return Math.round((raw * 100) / maxVolume);
	}
	
	/**
	 * Get the current volume setting (in percent)
	 * @return int the current volume setting in percent
	 */
	protected int getCurrentVolume(){
		try{
			int volLevel;
//			int maxVolume = manager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
			int currSystemVol = manager.getStreamVolume(AudioManager.STREAM_MUSIC);
//			volLevel = Math.round((currSystemVol * 100) / maxVolume);
			volLevel = getAsPercentVolume(currSystemVol);

			return volLevel;
		}catch (Exception e) {
			LOG.d("VolumeControl", "getVolume error: " + e);
			return 1;
		}
	}
	////////////////////////// original VolumeControl END /////////////////////////////////////
	
	protected void setRawVolume(int volumeAbsolutValue){
		init();
		manager.setStreamVolume(
				AudioManager.STREAM_MUSIC, 
				volumeAbsolutValue,
				AudioManager.FLAG_PLAY_SOUND
		);
	}
		
	private static final String NAME = "AppVolumeControl";
	private static final String KEY_VOLUME = "userAppVolume";

	public static final String RESULT_VALUE_NEW = "value";
	public static final String RESULT_VALUE_OLD = "oldValue";
	
	
	/**
	 * The "original" volume setting refers to the volume setting that was present
	 * before this activity was started/resumed.
	 * 
	 * NOTE: on closing, pausing the activity, this "original" volume setting should be restored.
	 */
	private int _originalVolumeSetting;
	
	private CordovaInterface cordovaActivity;
	
	private VolumeContentObserver _volumeSettingsObserver;
	private ArrayList<CallbackContext> _volumeListener = new ArrayList<CallbackContext>();
	
	protected int getCurrentRawVolume(){
		return manager.getStreamVolume(AudioManager.STREAM_MUSIC);
	}
		
	/**
	 * Writes current SYSTEM volume (STREAM_MUSIC) into field "original volume setting" (the setting that was/is active when this activity is NOT running),
	 * i.e. retrieve current system setting for volume (temporary storage).
	 * 
	 * NOTE: when this activity is closed/paused, this "original volume setting" should be restored.
	 * 
	 * {@link #_originalVolumeSetting}
	 */
	private void storeOriginalVolumeSetting(){
		init();
		this._originalVolumeSetting = getCurrentRawVolume();
	}

	/**
	 * Sets SYSTEM volume (STREAM_MUSIC) setting (back) to the "original volume setting" (i.e. the instance's field value),
	 * i.e. sets current system setting to this instance's value.
	 * 
	 * NOTE: this method should be called, before this activity is closed/paused
	 * NOTE2: the instance's field must have been initialized with the correct value before calling this method
	 * 			 (i.e. {@link #storeOriginalVolumeSetting()} on starting/resuming this activity).
	 * 
	 * 
	 * {@link #_originalVolumeSetting}
	 */
	private void restoreOriginalVolumeSetting(){
		init();
		setRawVolume(this._originalVolumeSetting);
//		manager.setStreamVolume(
//				AudioManager.STREAM_MUSIC,
//				this._originalVolumeSetting,
//				AudioManager.FLAG_PLAY_SOUND
//		);
	}
	
	/**
	 * Stores the (absolute) volume setting into the KEY_STORE (i.e. permanent storage).
	 * 
	 * @param userVolume
	 * @param userVolumeLevel
	 */
	private void storeUserVolumeSetting(int userVolume){
		init();
		
		SharedPreferences sharedPref = cordovaActivity.getActivity().getPreferences(Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = sharedPref.edit();
		editor.putInt(KEY_VOLUME, userVolume);
		editor.commit();

		LOG.d(NAME, "stored user volume setting: "+ userVolume+ "%");
	}
	
	/**
	 * Reads the volume setting from the KEY_STORE and sets the SYSTEM value accordingly.
	 * 
	 */
	private void restoreUserVolumeSetting(){
		init();

		SharedPreferences sharedPref = cordovaActivity.getActivity().getPreferences(Context.MODE_PRIVATE);
		if(sharedPref.contains(KEY_VOLUME)){
			int userVolume = sharedPref.getInt(KEY_VOLUME, -1);
			
			if(userVolume != -1){
				
				int volume = this.getAsRawVolume(userVolume);
				
				manager.setStreamVolume(
						AudioManager.STREAM_MUSIC,
						volume,
						AudioManager.FLAG_PLAY_SOUND
				);

				LOG.d(NAME, "restored user volume setting: "+ userVolume + "%");
			}
		}
		
	}
	
	public void addListener(CallbackContext callback){
		_volumeListener.add(callback);
	}
	
	public void removeListener(CallbackContext callback){
		_volumeListener.remove(callback);
	}
	
	private void init(){

		if(context == null)
			cordovaActivity = cordova;
		
		if(context == null)
			context = cordova.getActivity().getApplicationContext();
		
		if(manager == null)
			manager = (AudioManager)context.getSystemService(Context.AUDIO_SERVICE);
	}
	
	
	protected void doRegisterVolumeObserver(){
		if(this._volumeSettingsObserver == null){
			this._volumeSettingsObserver = new VolumeContentObserver( new Handler() ); 
			
			this.context.getContentResolver().registerContentObserver( 
				    android.provider.Settings.System.CONTENT_URI,
				    true, 
				    _volumeSettingsObserver 
			);
		}
	}
	
	protected void doUnregisterVolumeObserver(){
		if(this._volumeSettingsObserver != null){
			VolumeContentObserver temp = this._volumeSettingsObserver;
			this._volumeSettingsObserver = null;
			this.context.getContentResolver().unregisterContentObserver(temp);
		}
	}
	
	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		this.cordovaActivity = cordova;
		this.context = cordova.getActivity().getApplicationContext();
		
		this.storeOriginalVolumeSetting();
		LOG.d(NAME, "initializing: stored original volume setting: "+this._originalVolumeSetting);
		
		this.restoreUserVolumeSetting();
		
		this.doRegisterVolumeObserver();
		
		super.initialize(cordova, webView);
	}

	@Override
	public void onResume(boolean multitasking) {
		this.storeOriginalVolumeSetting();
		LOG.d(NAME, "resuming: stored original volume setting: "+this._originalVolumeSetting);
		
		this.restoreUserVolumeSetting();

		this.doRegisterVolumeObserver();
		
		super.onResume(multitasking);
	}

	@Override
	public void onPause(boolean multitasking) {
		
		//TODO only store, when plugin's exposed SETTER was called? 
		this.storeUserVolumeSetting(getCurrentVolume());
		
		LOG.d(NAME, "pausing: restoring original volume setting: "+this._originalVolumeSetting);
		this.restoreOriginalVolumeSetting();
		
		this.doUnregisterVolumeObserver();
		
		super.onPause(multitasking);
	}

	@Override
	public void onDestroy() {

		//TODO only store, when plugin's exposed SETTER was called?
		this.storeUserVolumeSetting(getCurrentVolume());
		
		LOG.d(NAME, "destroying: restoring original volume setting: "+this._originalVolumeSetting);
		this.restoreOriginalVolumeSetting();

		this.doUnregisterVolumeObserver();
		
		super.onDestroy();
	}
	
	private class VolumeContentObserver extends ContentObserver {

		private int _currentRawVolume;
		
		
		public VolumeContentObserver(Handler handler) {
		    super(handler);
		    this._currentRawVolume = getCurrentRawVolume();
		} 
		
		@Override
		public boolean deliverSelfNotifications() {
		     return super.deliverSelfNotifications(); 
		}
		
		@Override
		public void onChange(boolean selfChange) {
		    super.onChange(selfChange);
		    if(selfChange)
		    	return;
		    
		    int newValue = getCurrentRawVolume();
		    if(newValue != this._currentRawVolume){
		    	
		    	int oldValue = this._currentRawVolume;
			    this._currentRawVolume = newValue;
			    
			    Log.d(NAME, String.format("Volume settings change detected, RAW %d -> %d", oldValue, newValue));
			    
			    fireVolumeChanged(newValue, oldValue);
		    }
		}
		
		protected void fireVolumeChanged(int newRawValue, int oldRawValue){
			for(CallbackContext c : _volumeListener){
				JSONObject data = new JSONObject();
				String error = null;
				
				try {
					data.put(RESULT_VALUE_NEW, newRawValue);
				} catch (JSONException e) {
					error = e.toString();
				}
				try {
					data.put(RESULT_VALUE_NEW, getAsPercentVolume(newRawValue));
					data.put(RESULT_VALUE_OLD, getAsPercentVolume(oldRawValue));
				} catch (JSONException e) {
					if(error != null)
						error = ", " + e.toString();
					else
						error = e.toString();
				}
				
				PluginResult returnValue;
				if(error!=null)
					returnValue = new PluginResult(Status.ERROR, error);
				else 
					returnValue = new PluginResult(Status.OK,data);
				
				returnValue.setKeepCallback(true);
				c.sendPluginResult(returnValue);
			}
		}
	
	}

}
