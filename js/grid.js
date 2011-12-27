var grid = Array();
var spawns = Array();
var cur_id;
var cur_x;
var cur_y;
var grid_width;
var grid_height;

function isTileOnEdge(x,y) {
	if(x == 0 || x == grid_width-1 || y == 0 || y == grid_height-1) {
		return true;
	} else {
		return false;
	}
}

function getIdByCoords(x,y) {
	if(x >= 0 && x<= grid_width-1 && y>=0 && y<= grid_height-1) {
		return grid[y][x];
	} else {
		return false;
	}
}

function findAdjacentTiles(x,y) {
	id = getIdByCoords(x,y);
	adjTiles = Array();
	
	up = getIdByCoords(x,y-1);
	if(up) {
		adjTiles[0] = up;
	}
	
	right = getIdByCoords(x+1,y);
	if(right) {
		adjTiles[1] = right;
	}
	
	down = getIdByCoords(x,y+1);
	if(down) {
		adjTiles[2] = down;
	}
	
	left = getIdByCoords(x-1,y);
	if(left) {
		adjTiles[3] = left;
	}
	
	return adjTiles;
}

function getAdjacentWaypoint(x,y) {
	adjTiles = findAdjacentTiles(x,y);
	for (var i = 0; i < adjTiles.length; i++) {
		if(adjTiles[i]) {
			if($("#tile-"+adjTiles[i]).data('type') == "w") {
				return adjTiles[i];
			}
		}
	}
	return false;
}

function getNextWaypoint(x,y,dir) {
	if(dir == "n") {
		for (var i = y-1; i >= 0; i--) {
			id = changeTileAndReturnWaypointId(x,i);
			if(id) {
				break;
			}
		}
	}
	if(dir == "s") {
		for (var i = y+1; i <= grid_height-1; i++) {
			id = changeTileAndReturnWaypointId(x,i);
			if(id) {
				break;
			}
		}
	}
	if(dir == "w") {
		for (var i = x-1; i >= 0; i--) {
			id = changeTileAndReturnWaypointId(i,y);
			if(id) {
				break;
			}
		}
	}
	if(dir == "e") {
		for (var i = x+1; i <= grid_width-1; i++) {
			id = changeTileAndReturnWaypointId(i,y);
			if(id) {
				break;
			}
		}
	}
	
	//alert($('#tile-'+id).data('x')+","+$('#tile-'+id).data('y')+","+$('#tile-'+id).data('value'));
	
	if(id) {
		if($('#tile-'+id).data('type') != "g") {
			getNextWaypoint($('#tile-'+id).data('x'),$('#tile-'+id).data('y'),$('#tile-'+id).data('value'));
		} else {
			return id;
		}
	}
}

function changeTileAndReturnWaypointId(x,y) {

	id = getIdByCoords(x,y);
	turnTileIntoPath(id);
	
	if($('#tile-'+id).data('type') == "w" || $('#tile-'+id).data('type') == "g") {
		return id;
	}
	
	return false;
}

function turnTileIntoPath(id) {
	$('#tile-'+id).css('background','url(\'images/tiles.png\') 0 0');
}

function exportGridToJavaArray() {
	exp = "{";
	i = 0;
	for(j=0;j<grid_height;j++) {
		if(j==0) {
			exp += "{";
		} else {
			exp += ",{";
		}
		for(k=0;k<grid_width;k++) {
			i++;
			if(k==0) {
				exp += "\""+$('#tile-'+i).html()+"\"";
			} else {
				exp += ",\""+$('#tile-'+i).html()+"\"";
			}
		}
		exp += "}";
	}
	exp += "}";
	
	openAlertDialog("Export",exp);
}

function getTileInDirection(x,y,dir) {
	tile = false;
	switch(dir) {
		case 'up':
		case 0:
		case 'n':
		  tile = getIdByCoords(x,y-1);
		  break;
		case 'right':
		case 1:
		case 'e':
		  tile = getIdByCoords(x+1,y);
		  break;
		case 'down':
		case 2:
		case 's':
		  tile = getIdByCoords(x,y+1);
		  break;
		case 'left':
		case 3:
		case 'w':
		  tile = getIdByCoords(x-1,y);
		  break;
	}
	
	return tile;
}

