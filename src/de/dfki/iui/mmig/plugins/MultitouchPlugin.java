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


package de.dfki.iui.mmig.plugins;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;

import android.graphics.PointF;
import android.util.FloatMath;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.webkit.WebView;

//import com.phonegap.api.LOG;
import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;

/**
 * @author Florian Petersen
 * 
 */
public class MultitouchPlugin extends Plugin implements OnTouchListener {

	// string used for distinguishing action directory-listing
	private static final String ACTION_ADD_LISTENER = "addMultitouchListener";
	private static final String ACTION_REM_LISTENER = "removeMultitouchListener";
	private static final String ACTION_CHANGE_FREQUENCY = "changeMultitouchListenerFrequency";
	private static final String LOGTAG = "multiTouch";
	
	private enum EventType {
		 None, Pinch, Drag;  //; event types; is required here.
	}
	
	private EventType EVENTTYPE = EventType.Pinch;
	
	private Map<String,String> EVENTSLISTENING = new HashMap<String,String>();
	
//	private WebView webview = null;

   
	// We can be in one of these 3 states
	// but at the moment only zoom is properly handled
//	private static final byte NONE = 0;
//	private static final byte DRAG = 1;
//	private static final byte ZOOM = 2;
	
	private final long nanoToMilliFactor = 1000000;

	// name of the javascript event
	// maybe should be defined by the javascript funtion
	private static final String EVENTVALUE = "distance";
	private static final String EVENTCOORDX = "x";
	private static final String EVENTCOORDY = "y";
	
	private static String EVENTNAME = "pinch";
	private static String EVENTSOURCE= "document";
	private long EVENTPERIOD = nanoToMilliFactor * 200;

	private EventType mode = EventType.None;
	private long lastEventSend=0;
	

	// Remember some things for zooming
	private PointF start = new PointF();
	private PointF mid = new PointF();
	private float measuredDistance = 1f;

	public MultitouchPlugin() {
		// TODO Auto-generated constructor stub
	}
	
	/**
	 * Important to submit the webview to the plugin
	 * so just call: new MultitouchPlugin((WebView) getCurrentFocus());
	 */
//	public MultitouchPlugin(WebView currentwebview) {
//		// TODO Auto-generated constructor stub
//		this.webview = currentwebview;
//		
//		Log.d(LOGTAG, "webView: " + currentwebview.toString() + " =?= " + this.webView.toString());
//	}
	
	/**
	 * Important to submit the webview to the plugin
	 * @param eventFrequency - period in ms which resembles the time intervals between event-sending
	 * so just call: new MultitouchPlugin((WebView) getCurrentFocus(), 200);
	 */
//	public MultitouchPlugin(WebView currentwebview, long eventFrequency) {
//		// TODO Auto-generated constructor stub
//		this.webview = currentwebview;
//		this.EVENTPERIOD = eventFrequency;
//		Log.d(LOGTAG, "webView: " + currentwebview.toString() + " =?= " + this.webView.toString());
//	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.phonegap.api.Plugin#execute(java.lang.String,
	 * org.json.JSONArray, java.lang.String) data[0] - PATH-Name e.g.
	 * "applications" data[1] - filter e.g. ".ehtml"
	 * @param data[0] - eventtype - type of the event - see enum EventType... "pinch"
	 * @param data[1] - eventname - name of the event
	 * @param data[2] - event element - where to raise the event
	 * @param data[3] - period - how often to send events 
	 * 
	 * ACTION_REM_LISTENER
	 */
	@Override
	public PluginResult execute(String action, JSONArray data, String callbackId) {
		// TODO Auto-generated method stub
		PluginResult result = null;
		

		if (ACTION_ADD_LISTENER.equals(action)) {
			try {
				
				if (data.length() > 0) {
					if (data.getString(0).length() > 0){
						try{
							// Make sure the Eventtype-Parameter starts with a capital letter and then the rest is lower case
							EVENTTYPE = EventType.valueOf(data.getString(0).substring(0, 1).toUpperCase() + data.getString(0).substring(1).toLowerCase());
						}
						catch (IllegalArgumentException iae){
							EVENTTYPE = EventType.None;
							iae.printStackTrace();
						}
					}
				} 

				if (data.length() > 1) {
					if (data.getString(1).length() > 0){
						EVENTNAME = data.getString(1);
					}
				} 
				
				if (data.length() > 2) {
					if (data.getString(2).length() > 0){
						EVENTSOURCE = data.getString(2);
					}
				} 

				if (data.length() > 3) {
					if (data.getString(3).length() > 0){
						try {
							EVENTPERIOD = new Long(data.getString(3));
						} catch (NumberFormatException e) {
							// TODO Auto-generated catch block
							Log.e(LOGTAG, "Error: cannot convert '" + data.getString(3) + "' to long-type.");
							e.printStackTrace();
						}
					}
				}
				
				
				if (!(EVENTSLISTENING.containsKey(EVENTTYPE.name()))){
					// not already listening to this event
					EVENTSLISTENING.put(EVENTTYPE.name(), EVENTNAME);
					// attach Listener to webview
					// important: webview must be given as a parameter for the constructor of the plugin!
					Log.d(LOGTAG, "add onTouchlistener: '"+EVENTTYPE.name()+"'.");
					this.webView.setOnTouchListener(this);
				}

				// Create the Response/Result-Array
				JSONArray setEventResultArray = new JSONArray();
				setEventResultArray.put(EVENTNAME);
				setEventResultArray.put(EVENTSOURCE);
				setEventResultArray.put(EVENTPERIOD);
				
				result = new PluginResult(Status.OK, setEventResultArray);

			} catch (JSONException jsonEx) {
				Log.d(LOGTAG,
						"Got JSON Exception " + jsonEx.getMessage());
				result = new PluginResult(Status.JSON_EXCEPTION);
			}
		} else if (ACTION_REM_LISTENER.equals(action)) {
			if (data.length() > 0) {
				try {
					if (data.getString(0).length() > 0){
						try{
							// Make sure the Eventtype-Parameter starts with a capital letter and then the rest is lower case
							if (EVENTSLISTENING.containsKey(data.getString(0).substring(0, 1).toUpperCase() + data.getString(0).substring(1).toLowerCase())){
								EVENTSLISTENING.remove(data.getString(0).substring(0, 1).toUpperCase() + data.getString(0).substring(1).toLowerCase());
								Log.d(LOGTAG, "removed onTouchlistener: '"+data.getString(0).substring(0, 1).toUpperCase() + data.getString(0).substring(1).toLowerCase()+"'.\nEventListening: " + EVENTSLISTENING.keySet());
							}
						}
						catch (IllegalArgumentException iae){
							iae.printStackTrace();
							Log.d(LOGTAG, "[ERROR]: IllegalArgumentException");
						}

					}
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					Log.d(LOGTAG, "[ERROR]: JSONException");
				}
			}
			
			JSONArray setEventResultArray = new JSONArray();
			if (EVENTSLISTENING.isEmpty()){
				// remove onTouchHandler if no events should be listened to
				this.webView.setOnTouchListener(null);
			} else {
				for (String key : EVENTSLISTENING.keySet()){
					setEventResultArray.put(key);
				}
			}

			result = new PluginResult(Status.OK, setEventResultArray);
			
		} else if (ACTION_CHANGE_FREQUENCY.equals(action)) {
			if (data.length() > 0) {
				try {
					if (data.getString(0).length() > 0){
						long myEventPeriod;
						try {
							myEventPeriod = new Long(data.getString(0));
							myEventPeriod = nanoToMilliFactor * myEventPeriod;
						} catch (NumberFormatException e) {
							myEventPeriod = EVENTPERIOD;
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						EVENTPERIOD = myEventPeriod;
						Log.d(LOGTAG,"New Update Frequency: " + EVENTPERIOD);
					}
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					Log.d(LOGTAG, "[ERROR]: JSONException");
				}
			}
		}

		else {
			result = new PluginResult(Status.INVALID_ACTION);
			Log.d(LOGTAG, "Invalid action : " + action
					+ " passed");
		}

		return result;
	}

	@Override
	public boolean onTouch(View v, MotionEvent event) {
		long tmpTime = System.nanoTime(); 
		float relativeDistance = 0.0f; 

//		Log.d(LOGTAG, "Touch: " + event.getAction() +" -- Keys: "+ EVENTSLISTENING.keySet());
		// Handle touch events here...

		switch (event.getAction() & MotionEvent.ACTION_MASK) {
			case MotionEvent.ACTION_DOWN:
				// first finger is on the display
			     start.set(event.getX(), event.getY());
			     mode = EventType.Drag;
			     break;
			case MotionEvent.ACTION_POINTER_DOWN:
				// another finger is on the display - more than one on the display
				 if (event.getPointerCount() == 2){
					 measuredDistance = distance(event);
					 if (measuredDistance > 10f) {
						 midPoint(mid, event);
						 mode = EventType.Pinch;
				     }
				 }
			     break;
			case MotionEvent.ACTION_UP:
				// all fingers have been removed from the display
				 mode = EventType.None;
				 break;
			case MotionEvent.ACTION_POINTER_UP:
				// a finger has been removed from the display
				if (event.getPointerCount() < 2){
					mode = EventType.Drag;
				}
				break;
			case MotionEvent.ACTION_MOVE:
				// something moved... one finger or more
				if (mode == EventType.Drag) {
				}
				else if (mode == EventType.Pinch) {
					float newDist = distance(event);
			        if (newDist > 10f) {
			           relativeDistance = newDist - measuredDistance; 
//			           measuredDistance = newDist;
			        }
				}
				break;
		}

		// fire Event if it is time... check with frequency or better period
		if (tmpTime - lastEventSend > EVENTPERIOD){
			lastEventSend = tmpTime;
			if (mode == EventType.Pinch) {
	           measuredDistance = distance(event);
				if (EVENTSLISTENING.containsKey(mode.name())){
					if (v != null){
						if (event.getPointerCount() > 1){
							if (relativeDistance*relativeDistance < 0.1f){
								relativeDistance = 0;
							}
							// create Javascript-Event at EVENTSOURCE-node
							((WebView) v).loadUrl("javascript:(" +
									"function() {" +
//									"console.log(\"["+EVENTSOURCE+"] Event = "+EVENTSLISTENING.get(mode.name())+" -- relativeDistance: "+relativeDistance+"\");" +
									"var tmpTouchEvent = document.createEvent(\"Event\");" +
									"tmpTouchEvent.initEvent(\""+EVENTSLISTENING.get(mode.name())+"\", true, true);" +
									"tmpTouchEvent." +EVENTVALUE+" = " + relativeDistance+";" +
									"tmpTouchEvent." +EVENTCOORDX+" = " + mid.x +";" +
									"tmpTouchEvent." +EVENTCOORDY+" = " + mid.y +";" +
									 EVENTSOURCE + ".dispatchEvent(tmpTouchEvent);" +
//									 "console.log(tmpTouchEvent);" +
									"})();");
						}
					}
				}
				else {
//					LOG.d(LOGTAG, "No event pinch found.");
					System.out.println("[" + LOGTAG + "] No event pinch found.");
				}
			}
		}
	  	
		if (event.getPointerCount() > 1){
	  		return true;
	  	}
		return false;
	}
	
   /** Determine the space between the first two fingers */
   private float distance(MotionEvent event) {
      float x = event.getX(0) - event.getX(1);
      float y = event.getY(0) - event.getY(1);
      return FloatMath.sqrt(x * x + y * y);
   }

   /** Calculate the mid point of the first two fingers */
   private void midPoint(PointF point, MotionEvent event) {
      float x = event.getX(0) + event.getX(1);
      float y = event.getY(0) + event.getY(1);
      point.set(x / 2, y / 2);
   }


	/** Show an event in the LogCat view, for debugging */
	private void dumpEvent(MotionEvent event) {
	   String names[] = { "DOWN" , "UP" , "MOVE" , "CANCEL" , "OUTSIDE" ,
	      "POINTER_DOWN" , "POINTER_UP" , "7?" , "8?" , "9?" };
	   StringBuilder sb = new StringBuilder();
	   int action = event.getAction();
	   int actionCode = action & MotionEvent.ACTION_MASK;
	   sb.append("event ACTION_" ).append(names[actionCode]);
	   if (actionCode == MotionEvent.ACTION_POINTER_DOWN
	         || actionCode == MotionEvent.ACTION_POINTER_UP) {
	      sb.append("(pid " ).append(
	      action >> MotionEvent.ACTION_POINTER_ID_SHIFT);
	      sb.append(")" );
	   }
	   sb.append("[" );
	   for (int i = 0; i < event.getPointerCount(); i++) {
	      sb.append("#" ).append(i);
	      sb.append("(pid " ).append(event.getPointerId(i));
	      sb.append(")=" ).append((int) event.getX(i));
	      sb.append("," ).append((int) event.getY(i));
	      if (i + 1 < event.getPointerCount())
	         sb.append(";" );
	   }
	   sb.append("]" );
	   Log.d(LOGTAG, sb.toString());
	}

	
}
