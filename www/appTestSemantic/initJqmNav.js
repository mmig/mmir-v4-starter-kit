

	//manually implement bookmark-navigation
	// (by default jQuery Mobile interprest bookmarks as dialogs etc. ...)
//	$(function(){
	function initJqmBookmarking(){
		var links = $('a[href^="#"]');

		$('a[href^="#"]').on('click', function(evt){
			var tis = $(this);
			
			//do not 
			if(tis.data('rel') || tis.attr('href') === '#' || tis.data('jqm') == true)
				return true;

			var targetLink = tis.attr('href');
			var target = $(targetLink);
			if(target.length === 0){
				var targetName = targetLink.substring(1);
				target = $('[name="'+targetName+'"]');
			}
			var pos = target.offset();
			
			window.scrollTo(pos.left, pos.top);
			
			return false;
		});

	}
//	);
