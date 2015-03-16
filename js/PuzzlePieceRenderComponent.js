
function PuzzlePieceRenderComponent(){}

PuzzlePieceRenderComponent.prototype = new Component();

PuzzlePieceRenderComponent.prototype.dx = null;
PuzzlePieceRenderComponent.prototype.dy = null;

PuzzlePieceRenderComponent.prototype.onRender = function(context){
	if(this.dx == null){
		this.dx = (originalRaster.size.width / 2) - 
		          ((this.owner.offsetLeft * this.owner.width) + (this.owner.width / 2));
	}
	if(this.dy == null){
		this.dy = (originalRaster.size.height / 2) - 
		          ((this.owner.offsetTop * this.owner.height) + (this.owner.height / 2));
	}

	var px = this.owner.getCenterX() + this.dx;
	var py = this.owner.getCenterY() + this.dy;

	this.owner.tileImage.position.x = px;
	this.owner.tileImage.position.y = py;
	this.owner.borderImage.position.x = px;
	this.owner.borderImage.position.y = py;
}

PuzzlePieceRenderComponent.prototype.getSystems = function(){
	var systems = new Array();
	systems = ArrayUtils.addElement(systems, RenderSystem);
	return systems;
}

PuzzlePieceRenderComponent.prototype.getTag = function(){
	return "PUZZLE_PIECE_RENDER_COMPONENT";
}