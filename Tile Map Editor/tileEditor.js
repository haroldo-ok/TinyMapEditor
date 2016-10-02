var tinyMapEditor = (function() {
    var win = window,
        doc = document,
        pal = doc.getElementById('palette').getContext('2d'),
        map = doc.getElementById('layer1').getContext('2d'),
        layer3 = doc.getElementById('layer3').getContext('2d'),
        width = 10,
        height = 10,
        tileSize = 16,
        srcTile = 0,
        sprite = new Image(),
        tiles, // used for demo, not *really* needed atm
        alpha,

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
                	srcTile = { row : row, col : col };
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

            if (e.target.id === 'layer1' && srcTile && !draw) {
                destTile = this.getTile(e);
                hitable = document.getElementById('hitable').checked ? 0 : 1;
                hitable = !hitable
                if (hitable){
                	tiles[this.getTile(e).col][this.getTile(e).row].hit = !tiles[this.getTile(e).col][this.getTile(e).row].hit
                	if (tiles[this.getTile(e).col][this.getTile(e).row].hit == false){
                		layer3.clearRect(destTile.row * 32, destTile.col * 32, 32, 32);
                	}
                }
                if (!hitable){
	                tiles[this.getTile(e).col][this.getTile(e).row].base = srcTile.row + srcTile.col * 57
	                map.clearRect(destTile.row * 32, destTile.col * 32, 32, 32);
	                map.drawImage(sprite, srcTile.row * tileSize + 1 * srcTile.row, srcTile.col * tileSize + 1 * srcTile.col, tileSize, tileSize, destTile.row * 32, destTile.col * 32, 32, 32);
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
            var rect = doc.createElement('canvas'),
                ctx = rect.getContext('2d'),
                eraser = function() {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(0, 0, tileSize, tileSize);
                    ctx.fillStyle = 'white';
                    ctx.fillRect(2, 2, tileSize - 4, tileSize - 4);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.moveTo(tileSize, 0);
                    ctx.lineTo(0, tileSize);
                    ctx.stroke();
                };

            rect.width = rect.height = tileSize;
            doc.getElementById('selected').appendChild(rect);
            eraser();

            this.drawTool = function() {
                rect.width = tileSize;
                srcTile ? ctx.drawImage(sprite, srcTile.row * tileSize + 1 * srcTile.row, srcTile.col * tileSize + 1 * srcTile.col, tileSize, tileSize, 0, 0, tileSize, tileSize) : eraser();
            };
        },

        eraseTile : function(e) {
            var destTile;
            if (!draw) {
                if (e.target.id === 'erase' && srcTile) {
                    srcTile = 0;
                } else if (e.target.id === 'layer1' && !srcTile) {
                    destTile = this.getTile(e);
                    map.clearRect(destTile.row * 32, destTile.col * 32, 32, 32);
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