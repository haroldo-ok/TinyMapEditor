var tinyMapEditor = (function() {
    var win = window,
        doc = document,
        pal = doc.getElementById('palette').getContext('2d'),
        map = doc.getElementById('layer1').getContext('2d'),
        layer2 = doc.getElementById('layer2').getContext('2d'),
        layer3 = doc.getElementById('layer3').getContext('2d'),
        width = 10,
        height = 10,
        tileSize = 16,
        srcTile = 0,
        srcList = [],
        sprite = new Image(),
        tiles,
        alpha,
        tool = doc.getElementById('editTools').value,
        tileMode = doc.getElementById('mode').value,
        layer = doc.getElementById('layer').value,
        player,
        draw,
        build = doc.getElementById('build'),
        test = doc.getElementById('test');

    var app = {
        getTile : function(e) {
            if (e.target.nodeName === 'CANVAS') {
                if (e.target.id === 'palette'){
                	var row = (e.layerX - (1 * (e.layerX / tileSize) | 0)) / tileSize | 0,
                    	col = (e.layerY - (1 * (e.layerY / tileSize) | 0)) / tileSize | 0;
                	if (tileMode == "single"){
                		srcTile = { row : row, col : col };
                	};
                	if (tileMode == "random"){
                		srcList.push({ row : row, col : col });
                	};
                	
                	return { row : row, col : col };
                }
                if (e.target.id === 'layer1'){
                	var row = (e.layerX) / 32 | 0,
                    	col = (e.layerY) / 32 | 0;
                	return { row : row, col : col };
                }
            }
        },

        setTile : function(e) {
            var destTile;
            
            if (layer == "base"){
            	can = map
            }
            if (layer == "top"){
            	can = layer2
            }

            if (e.target.id === 'layer1' && srcTile && !draw) {
                destTile = this.getTile(e);
                if (tool == "hit"){
                	tiles[this.getTile(e).col][this.getTile(e).row].hit = !tiles[this.getTile(e).col][this.getTile(e).row].hit
                	if (tiles[this.getTile(e).col][this.getTile(e).row].hit == false){
                		layer3.clearRect(destTile.row * 32, destTile.col * 32, 32, 32);
                	}
                }
                if (tool == "stamp"){
	                if (layer == "base") {tiles[destTile.col][destTile.row].base = srcTile.row + srcTile.col * 57}
	                if (layer == "top") {tiles[destTile.col][destTile.row].top = srcTile.row + srcTile.col * 57}
	                can.clearRect(destTile.row * 32, destTile.col * 32, 32, 32);
	                can.drawImage(sprite, srcTile.row * tileSize + 1 * srcTile.row, srcTile.col * tileSize + 1 * srcTile.col, tileSize, tileSize, destTile.row * 32, destTile.col * 32, 32, 32);
                }
                if (tool == "fill"){
                	fillTile = tiles[destTile.col][destTile.row].base
                	fillMap = JSON.parse(JSON.stringify(tiles));
                	for (x = 0; x < width; x++) {
	                    for (y = 0; y < height; y++) {
	                    	if (fillMap[y][x].base == fillTile){
	                    		fillMap[y][x] = 1
	                    	}
	                    	else {
	                    		fillMap[y][x] = 0
	                    	}
	                    }
                	}
                	
                	if (tileMode == "random"){
                		st = srcList[Math.floor(Math.random()*srcList.length)]
                	}
                	if (tileMode == "single"){
                		var st = srcTile
                	}
                	
                	
                	var graph = new Graph(fillMap)
                	
                	if (layer == "base") {tiles[destTile.col][destTile.row].base = st.row + st.col * 57}
                	if (layer == "top") {tiles[destTile.col][destTile.row].top = st.row + st.col * 57}
                	can.clearRect(destTile.row * 32, destTile.col * 32, 32, 32);
                	can.drawImage(sprite, st.row * tileSize + 1 * st.row, st.col * tileSize + 1 * st.col, tileSize, tileSize, destTile.row * 32, destTile.col * 32, 32, 32);
                	
                	for (x = 0; x < width; x++) {
	                    for (y = 0; y < height; y++) {
	                    	var start = graph.grid[y][x];
	                    	var end = graph.grid[this.getTile(e).col][this.getTile(e).row];
	                    	var result = astar.search(graph, start, end);
	                    	if (result.length != 0 && fillMap[y][x] == 1){
	                    		if (tileMode == "random"){
	                        		st = srcList[Math.floor(Math.random()*srcList.length)]
	                        	}
	                    		if (layer == "base") {tiles[y][x].base = st.row + st.col * 57}
	                    		if (layer == "top") {tiles[y][x].top = st.row + st.col * 57}
	                    		can.clearRect(x * 32, y * 32, 32, 32);
	                    		can.drawImage(sprite, st.row * tileSize + 1 * st.row, st.col * tileSize + 1 * st.col, tileSize, tileSize, x * 32, y * 32, 32, 32);
	                  
	                    	}
	                    }
                    }
                }
                
                if (tiles[this.getTile(e).col][this.getTile(e).row].hit == true){
                	layer3.beginPath();
                	layer3.lineWidth="2";
                	layer3.strokeStyle="red";
                	layer3.rect(destTile.row * 32 + 1, destTile.col * 32 + 1, 32 - 2, 32 - 2); 
                	layer3.stroke();
                }
            }
        },

        drawTool : function() {
            rect = doc.createElement('canvas')
            ctx = rect.getContext('2d')
                eraser = function() {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(0, 0, 32, 32);
                    ctx.fillStyle = 'white';
                    ctx.fillRect(2, 2, 32 - 4, 32 - 4);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.moveTo(32, 0);
                    ctx.lineTo(0, 32);
                    ctx.stroke();
                };

            rect.width = rect.height = 32;
            doc.getElementById('selected').appendChild(rect);
            eraser();

            this.drawTool = function() {
            	if (tileMode == "single"){
            		console.log(rect)
	                rect.width = 32;
	                srcTile ? ctx.drawImage(sprite, srcTile.row * tileSize + 1 * srcTile.row, srcTile.col * tileSize + 1 * srcTile.col, tileSize, tileSize, 0, 0, 32, 32) : eraser();
            	}
            	if (tileMode == "random"){
            		if (srcList[srcList.length - 1] != undefined){
            			srcTile = true;
	        			rect = doc.createElement('canvas')
	                    ctx = rect.getContext('2d')
	                    rect.width = rect.height = 32;
	        			doc.getElementById('selected').appendChild(rect);
	        			ctx.drawImage(sprite, srcList[srcList.length - 1].row * tileSize + 1 * srcList[srcList.length - 1].row, srcList[srcList.length - 1].col * tileSize + 1 * srcList[srcList.length - 1].col, tileSize, tileSize, 0, 0, 32, 32);
            		}
            		else{
            			srcList.splice(srcList.length - 1, 1)
            		}
            	}
            };
        },

        eraseTile : function(e) {
            var destTile;
            if (!draw) {
                if (tool === 'erase' && srcTile) {
                    srcTile = 0;
                } else if (e.target.id === 'layer1' && !srcTile) {
                    destTile = this.getTile(e);
                    if (layer == "base") {
                    	map.clearRect(destTile.row * 32, destTile.col * 32, 32, 32);
                    	tiles[destTile.col][destTile.row].base = null
                    }
                    if (layer == "top") {
                    	layer2.clearRect(destTile.row * 32, destTile.col * 32, 32, 32);
                    	tiles[destTile.col][destTile.row].top = null
                    }
                    
                }
            }
        },

        drawMap : function() {
        	/*
        }
            var i, j, invert = document.getElementById('invert').checked ? 0 : 1;

            map.fillStyle = 'black';
            for (i = 0; i < width; i++) {
                for (j = 0; j < height; j++) {
                    if (alpha[i][j] === invert) {
                        map.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
                    } else if (typeof alpha[i][j] === 'object') {
                        // map.putImageData(tiles[i][j], i * tileSize, j * tileSize); // temp fix to colour collision layer black
                    }
                }
            }*/
        },

        clearMap : function(e) {
            if (e.target.id === 'clear') {
                map.clearRect(0, 0, map.canvas.width, map.canvas.height);
                tiles = []
                for (y = 0; y < width; y++) {
                	tiles[y] = []
                    for (x = 0; x < height; x++) {
                    	tiles[y][x] = {base: null, top:null, hit: false}
                    }
                }
                this.destroy();
                build.disabled = false;
            }
        },

        buildMap : function(e) {
            if (e.target.id === 'build') {
                var obj = {},
                    pixels,
                    len,
                    x, y, z;

                alpha = []; // collision map

                for (x = 0; x < width; x++) { // tiles across
                    alpha[x] = [];

                    /*for (y = 0; y < height; y++) { // tiles down
                        pixels = map.getImageData(x * tileSize, y * tileSize, tileSize, tileSize);
                        len = pixels.data.length;

                        alpha[x][y] = [];

                        for (z = 0; z < len; z += 4) {
                            pixels.data[z] = 0;
                            pixels.data[z + 1] = 0;
                            pixels.data[z + 2] = 0;
                            alpha[x][y][z / 4] = pixels.data[z + 3]; // store alpha data only
                        }

                        if (alpha[x][y].indexOf(0) === -1) { // solid tile
                            alpha[x][y] = 1;
                        } else if (alpha[x][y].indexOf(255) === -1) { // transparent tile
                            alpha[x][y] = 0;
                        } else { // partial alpha, build pixel map
                            alpha[x][y] = this.sortPartial(alpha[x][y]);
                        }
                    } */
                    for (x = 0; x < width; x++) {
	                    for (y = 0; y < height; y++) {
	                    	//this doesn't do anything yet
	                    }
                    }
                    
                }

                this.outputJSON();
                this.drawMap();
            }
        },

        sortPartial : function(arr) {
            var len = arr.length,
                temp = [],
                i, j;

            for (i = 0; i < tileSize; i++) {
                temp[i] = [];
                for (j = 0; j < len; j++) {
                    if (j % tileSize === j) {
                        temp[i][j] = arr[j * tileSize + i];
                    }
                }
                temp[i] = temp[i].indexOf(255);
            }
            return temp;
        },

        outputJSON : function() {
            output = JSON.stringify(tiles);
            doc.getElementsByTagName('textarea')[0].value = output;
        },

        bindEvents : function() {
            var _this = this;


            /**
             * Window events
             */

            win.addEventListener('click', function(e) {
                _this.setTile(e);
                _this.getTile(e);
                _this.eraseTile(e);
                _this.drawTool();
                _this.clearMap(e);
                _this.buildMap(e);
            }, false);


            /**
             * Image load event
             */

            sprite.addEventListener('load', function() {
                pal.canvas.width = this.width;
                pal.canvas.height = this.height;
                pal.drawImage(this, 0, 0);
            }, false);


            /**
             * Input change events
             */            
            document.getElementById('editTools').addEventListener('change', function() {
                tool = this.value;
            }, false);
            
            document.getElementById('layer').addEventListener('change', function() {
                layer = this.value;
            }, false);
            
            document.getElementById('mode').addEventListener('change', function() {
                tileMode = this.value;
                console.log("change")
                if (tileMode == "random"){
                	srcList = []
                	cntnt = doc.getElementById('selected')
                	console.log(cntnt.childNodes)
                	while (cntnt.childNodes.length > 3) {
                	    cntnt.removeChild(cntnt.lastChild);
                	}
                }
                if (tileMode == "single"){
                	while (cntnt.childNodes.length > 3) {
                	    cntnt.removeChild(cntnt.lastChild);
                	}
                	rect = doc.createElement('canvas')
                    ctx = rect.getContext('2d')
                    rect.width = rect.height = 32;
        			doc.getElementById('selected').appendChild(rect);
                }
            }, false);
            
            document.getElementById('width').addEventListener('change', function() {
                width = +this.value;
                _this.destroy();
                _this.init();
            }, false);

            document.getElementById('height').addEventListener('change', function() {
                height = +this.value;
                _this.destroy();
                _this.init();
            }, false);
            
            document.getElementById('size').addEventListener('change', function() {
                tileSize = +this.value;
                _this.destroy();
                _this.init();
            }, false);
        },

        init : function() {
            sprite.src = 'assets/outside.png';
            map.canvas.width = width * 32;
            map.canvas.height = height * 32;
            
            layer2.canvas.width = width * 32;
            layer2.canvas.height = height * 32;
            
            layer3.canvas.width = width * 32;
            layer3.canvas.height = height * 32;
            
            tiles = []
            for (y = 0; y < width; y++) {
            	tiles[y] = []
                for (x = 0; x < height; x++) {
                	tiles[y][x] = {base: null, top:null, hit: false}
                }
            }
            this.drawTool();
        },

        destroy : function() {
            clearInterval(draw);
            alpha = [];
        }
    };



    app.bindEvents();
    app.init();
    return app;

})();