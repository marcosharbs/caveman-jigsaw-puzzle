function DropPieceLayerComponent(){}

DropPieceLayerComponent.prototype = new Component();

DropPieceLayerComponent.prototype.onMouseMove = function(x, y){
	this.resetMovedObjects();
}

DropPieceLayerComponent.prototype.onTouchMove = function(touchList, changedTouches){
	this.resetMovedObjects();
}

DropPieceLayerComponent.prototype.onLoad = function(){
	this.resetMovedObjects();
}

DropPieceLayerComponent.prototype.resetMovedObjects = function(){
	this.owner.movedObjects = new Array();	
}

DropPieceLayerComponent.prototype.getSystems = function(){
	var systems = new Array();
	systems = ArrayUtils.addElement(systems, MouseSystem);
	systems = ArrayUtils.addElement(systems, TouchSystem);
	return systems;
}

DropPieceLayerComponent.prototype.getTag = function(){
	return "DROP_PUZZLE_PIECE_LAYER_COMPONENT";
}