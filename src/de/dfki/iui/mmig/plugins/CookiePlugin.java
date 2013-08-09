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

import android.webkit.CookieManager;

/**
 * Exposes the WebKit's CookieManager interface for handling Cookies.
 * 
 * @author russa
 *
 */
public class CookiePlugin extends CordovaPlugin {
	


    public CookiePlugin() {
    }

//	 synchronized boolean 	acceptCookie()
// 	Gets whether the application's WebView instances send and accept cookies.
    
// String 	getCookie(String url)
// 	Gets the cookies for the given URL.
    
// synchronized boolean 	hasCookies()
// 	Gets whether there are stored cookies.
    
// void 	removeAllCookie()
// 	Removes all cookies.
    
// void 	removeExpiredCookie()
// 	Removes all expired cookies.
    
// void 	removeSessionCookie()
//	 Removes all session cookies, which are cookies without an expiration date.
    
// synchronized void 	setAcceptCookie(boolean accept)
// 	Sets whether the application's WebView instances should send and accept cookies.
    
// void 	setCookie(String url, String value)
// 	Sets a cookie for the given URL.
    
    @Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
		
		if (action.equals("acceptCookie")) {
            boolean result = CookieManager.getInstance().acceptCookie();
			callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, result));
		} 
        else if (action.equals("getCookie")) {
            String cookies;
			try {
				cookies = CookieManager.getInstance().getCookie(args.getString(0));
				callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, cookies));
			} catch (JSONException e) {
				callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.ERROR, "missing argument String url"));
			}
        }
        else if (action.equals("hasCookies")) {
            boolean result = CookieManager.getInstance().hasCookies();
            callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, result));
		} 
        else if (action.equals("removeAllCookie")) {
            CookieManager.getInstance().removeAllCookie();
            callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, "done"));
		} 
        else if (action.equals("removeExpiredCookie")) {
            CookieManager.getInstance().removeExpiredCookie();
            callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, "done"));
		} 
        else if (action.equals("removeSessionCookie")) {
            CookieManager.getInstance().removeSessionCookie();
            callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, "done"));
		} 
        else if (action.equals("setAcceptCookie")) {
			try {
				CookieManager.getInstance().setAcceptCookie(args.getBoolean(0));
				callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, "done"));
			} catch (JSONException e) {
				callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.ERROR, "missing argument Boolean isAccept"));
			}
        }
        else if (action.equals("setCookie")) {
            String cookies;
			try {
				CookieManager.getInstance().setCookie(args.getString(0),args.getString(1));
				cookies = CookieManager.getInstance().getCookie(args.getString(0));
				callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, cookies));
			} catch (JSONException e) {
				callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.ERROR, "missing argument String url, or argument String value"));
			}
        }
		else {
			callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.INVALID_ACTION));
		}
		
		return true;
	}    
}

