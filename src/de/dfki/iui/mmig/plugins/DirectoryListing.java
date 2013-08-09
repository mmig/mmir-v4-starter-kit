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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.res.AssetManager;
import android.util.Log;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;

/**
 * @author Florian Petersen
 * 
 */
public class DirectoryListing extends CordovaPlugin {

	// path-prefix - not used by now
	// public static final String PREFIX_PATH="www/views/";
	public static final String PREFIX_PATH = "www/";
	// public static final String PREFIX_PATH = "";
	// public static final String CONTROLLER_PATH = "www/controllers";
	public static final String CONTROLLER_PATH = "controllers";
	// public static final String VIEWS_PATH = "www/views/";
	public static final String VIEWS_PATH = "views/";

	public static final String PHONEGAP_PATH_PREFIX = "android_asset/";

	// string used for distinguishing action directory-listing
	public static final String LISTDIRRECURSIVELY = "getDirectoryStructure";
	public static final String LISTDIRACTION = "getDirectoryListing";
	public static final String GETCONTROLLERANDVIEWS = "getControllerAndViews";
	public static final String CONTROLLERFILTER = "*.js";
	public static final String VIEWSFILTER = "*.ehtml";

	/**
	 * 
	 */
	public DirectoryListing() {
		// TODO Auto-generated constructor stub
	}
	
	
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.phonegap.api.Plugin#execute(java.lang.String,
	 * org.json.JSONArray, java.lang.String) data[0] - PATH-Name e.g.
	 * "applications" data[1] - filter e.g. ".ehtml"
	 */
	@Override
	public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {
		
		boolean isValidAction = true;
		PluginResult result = null;

		// This part (GETCONTROLLERANDVIEWS) is now implemented in Javascript
		if (GETCONTROLLERANDVIEWS.equals(action)) {
			JSONArray allControllersJSON = new JSONArray();

			String[] appAssets = null;
			List<String> listControllers = new ArrayList<String>();
			AssetManager appAssetManager = this.cordova.getActivity().getAssets();

			// get Controller-Filenames
			try {
				appAssets = appAssetManager.list(PREFIX_PATH + CONTROLLER_PATH);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			// Check if fileNames match filter
			for (String tmpAss : appAssets) {
				// TODO: check if it is a file or directory
				// System.out.println("Asset: " + tmpAss);
				// if (tmpAss.contains(filter)) {
				if (wildCardMatch(tmpAss, CONTROLLERFILTER)) {
					// listControllers.add(tmpAss);
					listControllers.add(CONTROLLER_PATH + "/" + tmpAss);
				}
			}

			for (String tmpCtrl : listControllers) {
				// System.out.println("tmpCtrl: " + tmpCtrl);
				allControllersJSON.put(getViewsForController(tmpCtrl));
			}

			// Log.d("PluginDirectoryListing", "Returning "+
			// dirListing.toString());
			result = new PluginResult(Status.OK, allControllersJSON);
		} else if (LISTDIRACTION.equals(action)) {
			try {
				String pathName = PREFIX_PATH + data.getString(0);

				String filter = "";
				if (data.length() > 1) {
					filter = data.getString(1);
				}

				String[] appAssets = null;
				List<String> listAssets = new ArrayList<String>();
				AssetManager appAssetManager = this.cordova.getActivity().getAssets();

				try {
					appAssets = appAssetManager.list(pathName);
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				for (String tmpAss : appAssets) {
					// TODO: check if it is a file or directory
					// System.out.println("Asset: " + tmpAss);
					// if (tmpAss.contains(filter)) {
					if (wildCardMatch(tmpAss, filter)) {
						listAssets.add(tmpAss);
					}
				}

				JSONArray dirListing = getJsonDirectoryListing(listAssets);

				// Log.d("PluginDirectoryListing", "Returning "+
				// dirListing.toString());

				result = new PluginResult(Status.OK, dirListing);

			} catch (JSONException jsonEx) {
				Log.d("PluginDirectoryListing", "Got JSON Exception " + jsonEx.getMessage());
				result = new PluginResult(Status.JSON_EXCEPTION);
			}
		} else if (action.equals(LISTDIRRECURSIVELY)) {

			JSONArray tmpParameterJsonArray = null;
			List<String> dirList = new ArrayList<String>();

			// Get list of dirs from parameter-array
			try {
				tmpParameterJsonArray = data.getJSONArray(0);
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			// convert list of dirs to a string-list
			for (int i = 0; i < tmpParameterJsonArray.length(); i++) {
				try {
					dirList.add(tmpParameterJsonArray.getString(i));
					// System.out.println("tmpParameterJsonArray.getJSONArray(0): "
					// + tmpParameterJsonArray.getString(i));
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

			JSONObject directoryStructure = new JSONObject();
			for (String dir : dirList) {
				directoryStructure = getDirectoryStructure(this.cordova.getActivity().getAssets(), dir, 1, directoryStructure);
			}
			

			tmpParameterJsonArray = null;
			data = null;
			dirList = null;

			result = new PluginResult(Status.OK, directoryStructure);
		} else {
			result = new PluginResult(Status.INVALID_ACTION);
			Log.d("PluginDirectoryListing", "Invalid action : " + action + " passed");
			isValidAction = false;
		}

//		return result;
		
		callbackContext.sendPluginResult(result);
		
		return isValidAction;
	}



	// ==========================
	JSONObject getDirectoryStructure(AssetManager mgr, String path, int level, JSONObject directoryStructure) {
		final String TAG = "getDirectoryStructure";

		JSONArray filesJSON = new JSONArray();

		// Log.v(TAG,"enter displayFiles("+path+")");
		try {
			String list[] = mgr.list(path);
			if ((list.length < 1) || (path.contains("."))) {
				// path is probably a file
				System.out.println("[" + TAG + "] " + path);
				return directoryStructure;
			} else {
				// path is probably a directory
				for (String f : list) {
					filesJSON.put(f);
				}
				// System.out.println("[" + TAG + "] " + filesJSON);
				try {
					directoryStructure.put("/" + PHONEGAP_PATH_PREFIX + path, filesJSON);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
			// Log.v(TAG,"L"+level+": list:"+ Arrays.asList(list));
			// System.out.println("[" + TAG + "] "
			// +directoryStructure.toString());

			if (list != null) {
				for (int i = 0; i < list.length; ++i) {
					if (level > 0) {
						directoryStructure = getDirectoryStructure(mgr, path + "/" + list[i], level + 1, directoryStructure);
					} else {
						directoryStructure = getDirectoryStructure(mgr, list[i], level + 1, directoryStructure);
					}
				}
			}
		} catch (IOException e) {
			Log.v(TAG, "List error: can't list" + path);
		}

		return directoryStructure;

	}

	// ==========================

	// private JSONObject getJsonDirectoryListing(List<String> fileNames) throws
	// JSONException {
	private JSONArray getJsonDirectoryListing(List<String> fileNames) throws JSONException {
		// JSONObject fileInfo = new JSONObject();
		JSONArray dirListingArray = new JSONArray();

		for (String tmpStr : fileNames) {
			dirListingArray.put(tmpStr);
		}
		return dirListingArray;
	}

	/**
	 * Searches for views for a given controlle-name
	 * 
	 * @param controllerName
	 *            the name of the controller for which the views should be found
	 * 
	 * @return JSONObject {"name": controlleName, "views":[LIST-OF-VIEWS]}
	 */
	private JSONObject getViewsForController(String controllerPath) {

		JSONObject tmpJSON = new JSONObject();
		String[] viewsList = null;
		String myControllerName = controllerPath.replaceAll("\\.[^.]+$", "").replaceAll("^.*/([^/]+)", "$1");

		StringBuilder viewPath = new StringBuilder();
		viewPath.append(PREFIX_PATH + VIEWS_PATH);
		// viewPath.append(controllerName);
		viewPath.append(myControllerName);

		// StringBuilder sbControllerName = new StringBuilder(controllerName);
		StringBuilder sbControllerName = new StringBuilder(myControllerName);
		sbControllerName.replace(0, 1, sbControllerName.substring(0, 1).toUpperCase());

		try {
			tmpJSON.put("name", sbControllerName);
			tmpJSON.put("path", controllerPath);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// get files in directory VIEWS_PATH
		try {
			viewsList = this.cordova.getActivity().getAssets().list(viewPath.toString());
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		// Create (Views-)Array of JSONObjects
		JSONArray tmpArray = new JSONArray();
		for (String tmpView : viewsList) {
			// TODO: check if it is a file or directory
			// System.out.println("Asset: " + tmpAss);
			if (wildCardMatch(tmpView, VIEWSFILTER)) {
				JSONObject tmpViewJSON = new JSONObject();
				try {
					tmpViewJSON.put("name", tmpView.replaceAll("\\.[^.]+$", ""));
					// tmpViewJSON.put("path", VIEWS_PATH + tmpView);
					tmpViewJSON.put("path", viewPath.toString() + "/" + tmpView);
					tmpArray.put(tmpViewJSON);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}

		try {
			tmpJSON.put("views", tmpArray);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return tmpJSON;
	}

	/**
	 * Performs a wildcard matching for the text and pattern provided.
	 * 
	 * @param text
	 *            the text to be tested for matches.
	 * 
	 * @param pattern
	 *            the pattern to be matched for. This can contain the wildcard
	 *            character '*' (asterisk).
	 * 
	 * @return <tt>true</tt> if a match is found, <tt>false</tt> otherwise.
	 */
	private boolean wildCardMatch(String text, String pattern) {
		return Pattern.matches(wildcardToRegex(pattern), text);
	}

	private static String wildcardToRegex(String wildcard) {
		StringBuffer s = new StringBuffer(wildcard.length());
		s.append('^');
		for (int i = 0, is = wildcard.length(); i < is; i++) {
			char c = wildcard.charAt(i);
			switch (c) {
			case '*':
				s.append(".*");
				break;
			case '?':
				s.append(".");
				break;
			// escape special regexp-characters
			case '(':
			case ')':
			case '[':
			case ']':
			case '$':
			case '^':
			case '.':
			case '{':
			case '}':
			case '|':
			case '\\':
				s.append("\\");
				s.append(c);
				break;
			default:
				s.append(c);
				break;
			}
		}
		s.append('$');
		return (s.toString());
	}

}
