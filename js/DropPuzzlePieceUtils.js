function DropPuzzlePieceUtils(){}

DropPuzzlePieceUtils.prototype.testSocketColision = function(socket){
    if(socket != null && socket.isJoined == false && socket.isColliding()){
        this.fitSocket(socket);
        socket.isJoined = true;
        socket.slave.isJoined = true;
        currentSocketsCount += 2;
    }
}

DropPuzzlePieceUtils.prototype.fitSocket = function(socket){
    var diffX = socket.slave.getCenterX() - socket.getCenterX();
    var diffY = socket.slave.getCenterY() - socket.getCenterY();
    var dropLayer = ComponentUtils.getComponent(layer, "DROP_PUZZLE_PIECE_LAYER_COMPONENT");
    dropLayer.resetMovedObjects();
    socket.parentPiece.addMoveAll(diffX, diffY, true);
}

DropPuzzlePieceUtils.prototype.onDropSockets = function(gameObject){
    this.testSocketColision(gameObject.leftSocket);
    this.testSocketColision(gameObject.rightSocket);
    this.testSocketColision(gameObject.topSocket);
    this.testSocketColision(gameObject.bottomSocket);
}

DropPuzzlePieceUtils.prototype.onDropGameObject = function(gameObject){
	for(var i=0; i<columns; i++){
    	for(var j=0; j<rows; j++){
    		var pieceObj = pieces[i][j];
			this.onDropSockets(pieceObj);
		}
	}
}