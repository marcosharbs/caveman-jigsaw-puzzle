var SCENE_LEFT       = -5000;
var SCENE_TOP        = -5000;
var SCENE_WIDTH      = 5000;
var SCENE_HEIGHT     = 5000;
var CANVAS_ID        = "canvas";
var UPLOAD_ID        = "imageUpload";
var SOCKET_LEFT      = "leftSocket";
var SOCKET_RIGHT     = "rightSocket";
var SOCKET_TOP       = "topSocket";
var SOCKET_BOTTOM    = "bottomSocket";
var COLUMNS_ID       = "columns";
var ROWS_ID          = "rows";
var CANVAS_HEIGHT_ID = "canvasHeight";
var CANVAS_WIDTH_ID  = "canvasWidth";
var CRUVE_SIZE       = 1.1;
var BORDER_COLOR     = "gray";
var BORDER_WIDTH     = 6;

var layer               = null;
var originalRaster      = null;
var socketsCount        = 0;
var currentSocketsCount = 0;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function createPiecesArray(columns, rows, pieceWidth, pieceHeight) {
    var pieces = new Array(columns);

    for(var i=0; i<columns; i++){
        var piecesAux = new Array(rows);
        for(var j=0; j<rows; j++){
            var pieceObj = new PuzzlePieceObject().initialize(getRandomArbitrary(0, canvas.width), 
                                                              getRandomArbitrary(0, canvas.height), 
                                                              pieceWidth, 
                                                              pieceHeight,
                                                              i, 
                                                              j);
            piecesAux[j] = pieceObj;
        }
        pieces[i] = piecesAux;
    }

    return pieces;
}

function createSockets(pieceObj, socket, otherPiece, otherSocket, hw1, hh1, hw2, hh2){
    var index = ((Math.floor(Math.random() * 9) + 0) % 2) == 0 ? 1 : -1;
    pieceObj[socket] = new PuzzleSocketObject().initialize(pieceObj.getCenterX() + hw1, 
                                                 pieceObj.getCenterY() + hh1, 
                                                 pieceObj);
    pieceObj[socket].enterFlg = index;

    otherPiece[otherSocket] = new PuzzleSocketObject().initialize(otherPiece.getCenterX() + hw2, 
                                                      otherPiece.getCenterY() + hh2, 
                                                      otherPiece);
    otherPiece[otherSocket].enterFlg = index;

    pieceObj[socket].slave = otherPiece[otherSocket];
    otherPiece[otherSocket].slave = pieceObj[socket];

    socketsCount += 2;
}

function createPieces(canvas, imgData){
	var columns = document.getElementById(COLUMNS_ID).value;
    var rows = document.getElementById(ROWS_ID).value;

    socketsCount = 0;
    currentSocketsCount = 0;

    originalRaster = new paper.Raster(imgData);
    originalRaster.visible = false;

    if(originalRaster.size.width > canvas.width){
        var wRatio = canvas.width / originalRaster.size.width;
        originalRaster.size.width = originalRaster.size.width * wRatio; 
        originalRaster.size.height = originalRaster.size.height * wRatio; 
    }
    if(originalRaster.size.height > canvas.height){
        var hRatio = canvas.height / originalRaster.size.height;
        originalRaster.size.width = originalRaster.size.width * hRatio; 
        originalRaster.size.height = originalRaster.size.height * hRatio; 
    }

    var pieceWidth = originalRaster.size.width / columns;
    var pieceHeight = originalRaster.size.height / rows;

    var pieces = createPiecesArray(columns, rows, pieceWidth, pieceHeight);

    var halfW = pieceWidth / 2;
    var halfH = pieceHeight / 2;

    for(var i=0; i<columns; i++){
    	for(var j=0; j<rows; j++){

    		var pieceObj = pieces[i][j];

    		if(pieceObj.leftSocket == null && i > 0){
                createSockets(pieceObj, SOCKET_LEFT, pieces[i-1][j], SOCKET_RIGHT, -halfW, 0, halfW, 0);
    		}
			if(pieceObj.rightSocket == null && i < (columns-1)){
                createSockets(pieceObj, SOCKET_RIGHT, pieces[i+1][j], SOCKET_LEFT, halfW, 0, -halfW, 0);
			}
			if(pieceObj.topSocket == null && j > 0){
                createSockets(pieceObj, SOCKET_TOP, pieces[i][j-1], SOCKET_BOTTOM, 0, -halfH, 0, halfH);
			}
			if(pieceObj.bottomSocket == null && j < (rows-1)){
                createSockets(pieceObj, SOCKET_BOTTOM, pieces[i][j+1], SOCKET_TOP, 0, halfH, 0, -halfH);
			}
    		
    		layer.addGameObject(pieceObj);

    		if(pieceObj.leftSocket != null){
    			layer.addGameObject(pieceObj.leftSocket);	
    		}
    		if(pieceObj.rightSocket != null){
    			layer.addGameObject(pieceObj.rightSocket);
    		}
    		if(pieceObj.topSocket != null){
    			layer.addGameObject(pieceObj.topSocket);
    		}
    		if(pieceObj.bottomSocket != null){
    			layer.addGameObject(pieceObj.bottomSocket);
    		}
    	}
    }

    for(var i=0; i<columns; i++){
        for(var j=0; j<rows; j++){
            var pieceObj = pieces[i][j];

            var raster = originalRaster.clone();
            raster.position = new paper.Point(raster.size.width/2, raster.size.height/2);
            raster.visible = true;

            var path = new paper.Path();

            var px = pieceObj.offsetLeft * pieceObj.width;
            var py =  pieceObj.offsetTop * pieceObj.height;

            var p1 = new paper.Point(px, py);
            var p2 = new paper.Point(px + pieceObj.width, py);
            var p3 = new paper.Point(px + pieceObj.width, py + pieceObj.height);
            var p4 = new paper.Point(px, py + pieceObj.height);

            path.moveTo(p1);
            path.lineTo(p1);

            var wSeg = pieceObj.width / 5;
            var hSeg = pieceObj.height / 5;

            var wCurveSize = wSeg * CRUVE_SIZE;
            var hCurveSize = hSeg * CRUVE_SIZE;

            if(pieceObj.topSocket != null){
                path.lineTo(new paper.Point(p1.x+(wSeg*2), p1.y));
                path.arcTo(new paper.Point(p1.x+(wSeg*2), p1.y+(wCurveSize*pieceObj.topSocket.enterFlg)), 
                           new paper.Point(p1.x+(wSeg*3), p1.y));
            }
            path.lineTo(p2);
            
            if(pieceObj.rightSocket != null){
                path.lineTo(new paper.Point(p2.x, p2.y+(hSeg*2)));
                path.arcTo(new paper.Point(p2.x+(hCurveSize*pieceObj.rightSocket.enterFlg), p2.y+(hSeg*2)), 
                           new paper.Point(p2.x, p2.y+(hSeg*3)));
            }
            path.lineTo(p3);    
            
            if(pieceObj.bottomSocket != null){
                path.lineTo(new paper.Point(p3.x-(wSeg*2), p3.y));
                path.arcTo(new paper.Point(p3.x-(wSeg*2), p3.y+(wCurveSize*pieceObj.bottomSocket.enterFlg)), 
                           new paper.Point(p3.x-(wSeg*3), p3.y));
            }
            path.lineTo(p4);    

            if(pieceObj.leftSocket != null){
                path.lineTo(new paper.Point(p4.x, p4.y-(hSeg*2)));
                path.arcTo(new paper.Point(p4.x+(hCurveSize*pieceObj.leftSocket.enterFlg), p4.y-(hSeg*2)), 
                           new paper.Point(p4.x, p4.y-(hSeg*3)));
            }
            path.lineTo(p1);    

            var borderPath = path.clone();
            borderPath.strokeColor = BORDER_COLOR;
            borderPath.strokeWodth = BORDER_WIDTH;

            var borderGroupPath = new paper.Path();
            borderGroupPath.moveTo(new paper.Point(0, 0));
            borderGroupPath.lineTo(new paper.Point(raster.size.width, 0));
            borderGroupPath.lineTo(new paper.Point(raster.size.width, raster.size.height));
            borderGroupPath.lineTo(new paper.Point(0, raster.size.height));
            borderGroupPath.lineTo(new paper.Point(0, 0));

            var group = new paper.Group([path, raster]);
            group.clipped = true;

            var borderGroup = new paper.Group([borderPath, borderGroupPath]);

            pieceObj.tileImage = group;
            pieceObj.borderImage = borderGroup;
        }
    }
}

function createPuzzle(imgData){
    var canvas = document.getElementById(CANVAS_ID);

    paper.setup(canvas);

	layer = new Layer().initialize();

    var scene = new Scene().initialize(SCENE_LEFT, 
                                       SCENE_TOP, 
                                       SCENE_WIDTH, 
                                       SCENE_HEIGHT);

    createPieces(canvas, imgData);

    scene.addLayer(layer);

	layer.setGravity(0);

    ComponentUtils.addComponent(layer, new DropPieceLayerComponent().initialize());
    ComponentUtils.addComponent(layer, 
                                new DragControlComponent().
                                                initialize(new DropPuzzlePieceUtils()));

	Game.init(canvas, scene);

	Game.camera.centerPoint.x = canvas.width / 2; 
    Game.camera.centerPoint.y = canvas.height / 2;

    RenderSystem.clearCanvas = false;

    ComponentUtils.addComponent(Game, new PaperJsRenderComponent().initialize());
}

function handleImageSelect(evt) {
	var file = document.getElementById(UPLOAD_ID).files[0];
	
	var reader  = new FileReader();

	reader.onloadend = function () {
		createPuzzle(reader.result);
        document.getElementById(COLUMNS_ID).disabled       = true;
        document.getElementById(ROWS_ID).disabled          = true;
        document.getElementById(CANVAS_WIDTH_ID).disabled  = true;
        document.getElementById(CANVAS_HEIGHT_ID).disabled = true;
        document.getElementById(UPLOAD_ID).disabled        = true;
  	}

  	if (file) {
    	reader.readAsDataURL(file);
  	}
}

window.onload = function(){
	document.getElementById(UPLOAD_ID).addEventListener('change', handleImageSelect, false);
    var w = screen.width - 50;
    var h = screen.height - 250;
    document.getElementById(CANVAS_ID).width = w;
    document.getElementById(CANVAS_ID).height = h;
    document.getElementById(CANVAS_WIDTH_ID).value = w;
    document.getElementById(CANVAS_HEIGHT_ID).value = h;
}
