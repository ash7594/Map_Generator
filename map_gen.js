var map,
	images = {},
	canvas,
	bgCanvas;

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
