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


 package de.dfki.iui.mmig.starterkit;

import org.apache.cordova.DroidGap;

import android.os.Bundle;
//import android.view.View;
//import android.view.WindowManager;
//import android.webkit.CookieManager;


public class MMIGAppActivity extends DroidGap {
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
//		CookieManager.setAcceptFileSchemeCookies(true);
		
		//INCREASE TIMEOUT if you get the error message
		//			 "Connection to Server Unsuccessful"
		//			on application startup.
		//			This error is trigger, when the first page takes
		//			too long to load.
		//			This may be due to different reasons, e.g.
		//			 * the page is too large
		//			 * the page references network resources (e.g. scripts/css-files)
		//			   and the the network connection is too slow
		//			 * the application is run in an emulator (which my take too long, so the timeout is triggered)
		//			...
		//
		// in this case, try to increase the timeout:
		super.setIntegerProperty("loadUrlTimeoutValue", 120000);
		
		super.loadUrl("file:///android_asset/www/index.html?env=cordova");

//		CookieManager.getInstance().setAcceptCookie(true);
		
		//disable taphold (i.e. 'long touch'-events):
//		super.appView.setOnLongClickListener(new View.OnLongClickListener() {
//            public boolean onLongClick(View v) {
//                return true;
//            }
//        });
		
//		//hide task bar (does not work on tables with Android > 4.x.x)
//		getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN);
//		getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
//		getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
//		
//		
//		getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
//		
//
//		//"overlay" task bar (i.e. hide/dim out the controls; but they are still ative) for Android level 14
//		getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE);
	}
	
}