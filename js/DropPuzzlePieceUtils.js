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

DropPuzzlePieceUtils.prototype.onDropSocketsJoined = function(socket){
    if(socket != null && socket.isJoined == true){
        this.onDropSockets(socket.slave.parentPiece);
    }
}

DropPuzzlePieceUtils.prototype.onDropGameObject = function(gameObject){
    this.onDropSockets(gameObject);
    this.onDropSocketsJoined(gameObject.leftSocket);
    this.onDropSocketsJoined(gameObject.rightSocket);
    this.onDropSocketsJoined(gameObject.topSocket);
    this.onDropSocketsJoined(gameObject.bottomSocket);
}