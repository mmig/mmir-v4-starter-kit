package de.dfki.iui.mmig.plugins;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;

import org.json.JSONArray;
import org.json.JSONException;


public class QueuePlugin extends CordovaPlugin{
	ArrayList<LinkedList<Object>> queueList = new ArrayList<LinkedList<Object>>(2);
	ArrayList<Boolean> isReady = new ArrayList<Boolean>(2);
	public QueuePlugin(){
		
	}
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
	try {	
		PluginResult result = null;
		if(action.equals("newQueue") && args.length()>=1)
		{
				result = newQueue(args.getInt(0));
		}
		else if(action.equals("newJob") && args.length()>= 2){
				
				result = newJob(args.getInt(0), args.getJSONObject(1));
		}
		else if(action.equals("readyForJob") && args.length()>=1){
				result = readyForJob(args.getInt(0));
		}
		if (result!=null){
			callbackContext.sendPluginResult(result);
		}
	} catch (JSONException e) {
		e.printStackTrace();
		callbackContext.sendPluginResult(new PluginResult(Status.JSON_EXCEPTION,"Wrong arguments"));
	}
		return true;
	}

	private synchronized PluginResult readyForJob(Integer id) {
		isReady.set(id, true);
		return distributeJobs(id);
	}

	private synchronized PluginResult distributeJobs(Integer id) {
		if (isReady.get(id) && (!queueList.get(id).isEmpty())){
			isReady.set(id,false);
			JSONArray event = new JSONArray();
			event.put(id);
			event.put(queueList.get(id).pollLast());
			return new PluginResult(Status.OK,event);
		}
		return null;
	}

	private synchronized PluginResult newJob(Integer id,Object event) {
		queueList.get(id).addFirst(event);
		return distributeJobs(id);
	}

	private synchronized PluginResult newQueue(int id) {
		if (queueList.size()!= id)
			System.out.println("Warning: Queue-Indices out of Sync!");
		queueList.add(new LinkedList<Object>());
		isReady.add(true);
		return null;
	}

}
