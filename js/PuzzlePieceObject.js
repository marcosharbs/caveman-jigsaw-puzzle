function PuzzlePieceObject(){}

PuzzlePieceObject.prototype = new BoxObject();

JSUtils.addMethod(PuzzlePieceObject.prototype, "initialize", 
	function(x, y, width, height, offsetLeft, offsetTop){
		this.initialize(x, y, width, height);
		
		//atributos
		this.leftSocket   = null;
		this.rightSocket  = null;
		this.topSocket    = null;
		this.bottomSocket = null;
		this.tileImage    = null;
		this.offsetLeft   = offsetLeft;
		this.offsetTop    = offsetTop;

		//componentes
		ComponentUtils.addComponent(this, new DraggableComponent().initialize());
		ComponentUtils.addComponent(this, new PuzzlePieceRenderComponent().initialize());
		ComponentUtils.addComponent(this, new RigidBodyComponent().initialize(0, 1, false, false, 0, false, false));
		
		return this;
	}
);

PuzzlePieceObject.prototype.addMoveSocket = function(socket, x, y, moveAll){
	if(socket != null){
		socket.addMove(x, y);
		if(moveAll && socket.isJoined){
			socket.slave.parentPiece.addMove(x, y, moveAll);
		}
	}
}

PuzzlePieceObject.prototype.addMoveObject = function(x, y){
	if(this.body){
		if(this instanceof PolygonObject){
			this.body.m_shapeList.m_body.m_position.x += x;
			this.body.m_shapeList.m_body.m_position.y += y;
		}else{
			this.body.m_position.x += x;
			this.body.m_position.y += y;
		}
	}else{
		this.origin.x += x;
		this.origin.y += y;
	}
}

PuzzlePieceObject.prototype.addMoveAll = function(x, y, moveAll){
	if(ArrayUtils.contains(layer.movedObjects, this.id) == false || moveAll == false){
		if(moveAll == true){
			layer.movedObjects = ArrayUtils.addElement(layer.movedObjects, this.id);
		}	
		this.addMoveObject(x, y);
		this.addMoveSocket(this.leftSocket,   x, y, moveAll);
		this.addMoveSocket(this.rightSocket,  x, y, moveAll);
		this.addMoveSocket(this.topSocket,    x, y, moveAll);
		this.addMoveSocket(this.bottomSocket, x, y, moveAll);
	}
}

PuzzlePieceObject.prototype.addMove = function(x, y){
	this.addMoveAll(x, y, true);
}

PuzzlePieceObject.prototype.getTag = function(){
	return "PUZZLE_PIECE_OBJECT";
}