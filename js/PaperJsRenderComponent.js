function PaperJsRenderComponent(){}

PaperJsRenderComponent.prototype = new Component();

PaperJsRenderComponent.prototype.finished = false;

PaperJsRenderComponent.prototype.onUpdate = function(delta){
	if(currentSocketsCount == socketsCount && this.finished == false){
		this.finished = true;
		BootstrapDialog.show({
            title: 'Congratulations!',
            message: 'You completed the Puzzle.'
        });
	}
}

PaperJsRenderComponent.prototype.onRender = function(context){
	paper.view.draw();
}

PaperJsRenderComponent.prototype.getSystems = function(){
	var systems = new Array();
	systems = ArrayUtils.addElement(systems, RenderSystem);
	systems = ArrayUtils.addElement(systems, LogicSystem);
	return systems;
}

PaperJsRenderComponent.prototype.getTag = function(){
	return "PAPER_JS_RENDER_COMPONENT";
}