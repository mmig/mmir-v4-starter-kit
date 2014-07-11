// emulate Controller
Controller = function(name, jsonDef){
	var self = this;
	if (name != null){
		this.name = name;
		// jstestdriver.console.log("[DEBUG - Controller] New Name: " + this.name);
	}
	return {
		loadHelper: function(name, path){
		},
		
		getName: function(){
			// jstestdriver.console.log("[DEBUG - Controller] Name: " + self.name);
			return self.name;
		}
	}
};

