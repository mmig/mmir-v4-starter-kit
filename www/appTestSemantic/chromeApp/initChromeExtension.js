

chrome.browserAction.onClicked.addListener(function(extensionTab) {

	//create tab and load grammar viewer index.html
	chrome.tabs.create({
			url: '/testSemanticInterpreter.html'
		}, function (viewerTab){
			
			console.info('created tab for Grammar Tester APP (id '+viewerTab.id+')');
			
		}
	);
		
});
