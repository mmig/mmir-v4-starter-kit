
if(!Element.prototype.remove){
	Element.prototype.remove = function removeImpl () {
		this.parentNode.removeChild(this);
	};
}