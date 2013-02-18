package com.cordova.plugin.softkeyboard;

/*
 * Taken from 
 * https://github.com/phonegap/phonegap-plugins/tree/master/Android/SoftKeyboard
 * and 
 * http://ambrusmartin.wordpress.com/2012/08/30/soft-keyboards-in-android-iphone-phonegap-applications-when-we-call-focus/
 * 
 * The MIT License
 * 
 * Copyright (c) 2009-2012 Paul Panserrieu, Naokazu Terada, (zathrus) smejko
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *  
 */
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;

import org.json.JSONArray;
import android.content.Context;
import android.view.KeyEvent;
import android.view.inputmethod.InputMethodManager;

public class SoftKeyBoard extends CordovaPlugin {

    public SoftKeyBoard() {
    }

    public void showKeyBoard() {
    	
//	        //use this for PhoneGape version before 2.0:
//    		InputMethodManager mgr = (InputMethodManager) this.ctx.getSystemService(Context.INPUT_METHOD_SERVICE);
    		InputMethodManager mgr = (InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
	        mgr.showSoftInput(webView, InputMethodManager.SHOW_IMPLICIT);
	
//	        //use this for PhoneGape version before 2.0:
//	        ((InputMethodManager) this.ctx.getSystemService(Context.INPUT_METHOD_SERVICE)).showSoftInput(webView, 0);
	        ((InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE)).showSoftInput(webView, 0);

            // this code will send a "DELETE" keypress to your page, thus making your input active and moving caret inside it
            
//	        // replace cordova.getActivity() by this.ctx  if running PhoneGap before version 2.0
//	        this.ctx.runOnUiThread(new Runnable() {
	        cordova.getActivity().runOnUiThread(new Runnable() {
	        	public void run() {
	    	        webView.dispatchKeyEvent(new KeyEvent( KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_DEL ));
	    	        webView.dispatchKeyEvent(new KeyEvent( KeyEvent.ACTION_UP, KeyEvent.KEYCODE_DEL ));
	        	}
	        });
    	
    }
    
    public void hideKeyBoard() {
        //use this for PhoneGape version before 2.0: InputMethodManager mgr = (InputMethodManager) this.ctx.getSystemService(Context.INPUT_METHOD_SERVICE);
    	InputMethodManager mgr = (InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        mgr.hideSoftInputFromWindow(webView.getWindowToken(), 0);
    }
    
    public boolean isKeyBoardShowing() {
        
    	int heightDiff = webView.getRootView().getHeight() - webView.getHeight();
    	return (100 < heightDiff); // if more than 100 pixels, its probably a keyboard...
    }

	public PluginResult execute(String action, JSONArray args, String callbackId) {
		if (action.equals("show")) {
            this.showKeyBoard();
			return new PluginResult(PluginResult.Status.OK, "done");
		} 
        else if (action.equals("hide")) {
            this.hideKeyBoard();
            return new PluginResult(PluginResult.Status.OK);
        }
        else if (action.equals("isShowing")) {
			
            return new PluginResult(PluginResult.Status.OK, this.isKeyBoardShowing());
        }
		else {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
	}    
}
