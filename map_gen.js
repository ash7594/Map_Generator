var map,
	images = {},
	canvas,
	bgCanvas;

const TILE_FLOOR = 0, TILE_WALL = 1;
const size_x = 34, size_y = 18, fillprob = 40, generations = 2;

var generation_params = function (r1_cutoff, r2_cutoff, reps) {
	this.r1_cutoff = r1_cutoff;
	this.r2_cutoff = r2_cutoff;
	this.reps = reps;
}

var params;
var grid, grid2;

function generation(index) {
	var yi,xi,ii,jj;

	for(yi=1; yi<size_y-1; yi++) {
    	for(xi=1; xi<size_x-1; xi++) {
        	var adjcount_r1 = 0,
            	adjcount_r2 = 0;
 
  	      	for(ii=-1; ii<=1; ii++) {
    	    	for(jj=-1; jj<=1; jj++) {
            		if(grid[yi+ii][xi+jj] != TILE_FLOOR)
                		adjcount_r1++;
        		}
			}

        	for(ii=yi-2; ii<=yi+2; ii++) {
        		for(jj=xi-2; jj<=xi+2; jj++) {
            		if(Math.abs(ii-yi)==2 && Math.abs(jj-xi)==2)
                		continue;
            		if(ii<0 || jj<0 || ii>=size_y || jj>=size_x)
                		continue;
            		if(grid[ii][jj] != TILE_FLOOR)
                		adjcount_r2++;
        		}
			}

        	if(adjcount_r1 >= params[index].r1_cutoff || adjcount_r2 <= params[index].r2_cutoff)
            	grid2[yi][xi] = TILE_WALL;
        	else
            	grid2[yi][xi] = TILE_FLOOR;
    	}
	}

    for(yi=1; yi<size_y-1; yi++) {
    	for(xi=1; xi<size_x-1; xi++) {
        	grid[yi][xi] = grid2[yi][xi];
		}
	}
}

function map_gen () {
	var argc = 10;

	params = new Array(generations);
	params[0] = new generation_params(5,2,4);
	params[1] = new generation_params(5,-1,3);

	initMap();

	for (var i=0;i<generations;i++) {
		for (var j=0;j<params[i].reps;j++)
			generation(i);
	}

	mapAssign();
}

function mapAssign() {
	for (var i=0;i<size_y;i++) {
		for (var j=0;j<size_x;j++) {
			map.data[i*map.width + j] = grid[i][j];
		}
	}
}

function makeArray(element, index, array) {
	array[index] = new Array(size_x);
}

function randpick() {
	if (Math.random()*100 < fillprob)
		return TILE_WALL;
	else
		return TILE_FLOOR;
}

function initMap () {
	grid = new Array(size_y);
	//grid.forEach(makeArray);
	for (var i=0;i<size_y;i++) {
		grid[i] = new Array(size_x);
	}

	grid2 = new Array(size_y);
	//grid2.forEach(makeArray);
	for (var i=0;i<size_y;i++) {
		grid2[i] = new Array(size_x);
	}

	for (var i=1;i<size_y-1;i++) {
		for (var j=1;j<size_x-1;j++) {
			grid[i][j] = randpick();
		}
	}
	
	for (var i=0;i<size_y;i++) {
		for (var j=0;j<size_x;j++) {
			grid2[i][j] = TILE_WALL;
		}
	}

	for (var i=0;i<size_y;i++) {
		grid[i][0] = grid[i][size_x-1] = TILE_WALL;
	}
	for (var i=0;i<size_x;i++) {
		grid[0][i] = grid[size_y-1][i] = TILE_WALL;
	}
}

function loadJSON(file, callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
}
 
function load() {
    loadJSON("maze.json", function(response) {
  
        map = JSON.parse(response);
        //document.write(map);
		//window.setImmediate(initElements);
		initElements();
    }); 
}

function initElements() {
    canvas = document.getElementById('render-canvas');
    ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    //setImmediate(render);
	//render();
	map_gen();	
	drawBG();
}
/*
function loadImages(imgList, callback) {
    function cbWrap(i) {
        return function() {
            if(i >= imgList.length) {
                //setImmediate(callback);
				callback();
                return;
            }
            img = new Image;
            img.onload = cbWrap(i + 1);
            images[imgList[i]] = img;
            img.src = imgList[i];
        }
    }
    //setImmediate(cbWrap(0));
	cbWrap(0);
}

function render() {
    idx = 0;
    var imgList = [], i, img;
    for(i in map.tiledata) {
        if(map.tiledata.hasOwnProperty(i)) {
            img = map.tiledata[i].image;
            if(img && imgList.indexOf(img) == -1) {
                imgList.push(img);
            }
        }
    }
    loadImages(imgList, drawBG);
}
*/
function drawBG() {
    bgCanvas = document.createElement('canvas');
    bgCanvas.width = map.width * map.tilewidth;
    bgCanvas.height = map.height * map.tileheight;
    var bgCtx = bgCanvas.getContext('2d'), i, j, d, tile;
    for(i = 0; i < map.height; i++) {
        for(j = 0; j < map.width; j++) {
            d = map.data[i * map.width + j];
            if(d != 0) {
                tile = map.tiledata[d];
				bgCtx.fillStyle = "#000000";
				bgCtx.fillRect(j * map.tilewidth, i * map.tileheight,
								map.tilewidth, map.tileheight);
                /*bgCtx.drawImage(images[tile.image],
                                tile.j * map.tilewidth, 
                                tile.i * map.tileheight,
                                map.tilewidth, map.tileheight,
                                j * map.tilewidth, i * map.tileheight,
                                map.tilewidth, map.tileheight);
				*/
            }
        }
    }
    for(i = 0; i <= map.height; i++) {
        bgCtx.beginPath();
        bgCtx.moveTo(0, i * map.tileheight);
        bgCtx.lineTo(bgCanvas.width, i * map.tileheight);
        bgCtx.stroke();
        bgCtx.closePath();
    }
    for(i = 0; i <= map.width; i++) {
        bgCtx.beginPath();
        bgCtx.moveTo(i * map.tilewidth, 0);
        bgCtx.lineTo(i * map.tilewidth, bgCanvas.height);
        bgCtx.stroke();
        bgCtx.closePath();
    }
    canvas.width = bgCanvas.width;
    canvas.height = bgCanvas.height;
    //state = DONE;
    //setImmediate(draw);
	draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawState();
//    if(state == LOADING) {
//        drawText('Loading...', 32);
//    } else if(state == ERROR) {
//
//    } else if(state == DONE) {
//        drawState();
//    }
    requestAnimationFrame(draw);
}

function drawState() {
	ctx.drawImage(bgCanvas, 0, 0);
}

load();
