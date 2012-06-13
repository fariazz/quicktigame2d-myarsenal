/*
 * quicktigame2d-myarsenal.GameMap
 * 
 * Map class
 */

var quicktigame2d = require('com.googlecode.quicktigame2d');

GameMap = function() {
	
	//tilemap with map
	this.tilemap = {};
	
	//tilemap with blocked cells
	this.blockedmap = {};
	
	//map tile id that represents blocked cells
	this.blocked_id;
	
	//indexes of all blocking elements
	this.blockedIndexes = new Array();
	
	this.camera_dx = 0;
	this.camera_dy = 0;
	
	//game view
	this.gameView;
}

/*
 * Get cell row, col from x, y screen coordinates
 * @param int x position in the map
 * @param int y position in the map 
 * @return Object
 */
GameMap.prototype.getCellFromScreenXY = function(x,y) {
	
	x = x+this.camera_dx;
	y = y+this.camera_dy;
	
	var col = parseInt((x - x%this.tilemap.tileWidth)/this.tilemap.tileWidth);
	var row = parseInt((y - y%this.tilemap.tileHeight)/this.tilemap.tileHeight);
	
	return {'col': col, 'row': row};
}

/*
 * Get cell row, col from x, y map coordinates
 * @param int x position in the map
 * @param int y position in the map 
 * @return Object
 */
GameMap.prototype.getCellFromMapXY = function(x,y) {
	
	var col = parseInt((x - x%this.tilemap.tileWidth)/this.tilemap.tileWidth);
	var row = parseInt((y - y%this.tilemap.tileHeight)/this.tilemap.tileHeight);
	
	return {'col': col, 'row': row};
}

/*
 * Get x, y map coordinates of a given cell
 * @param int col column, starting from 0
 * @param int row row, starting from 0
 * @param boolean centered, if true return the center of the cell, otherwise return the upper left corner
 * @return Object
 */
GameMap.prototype.getMapXYFromCell = function(col,row, centered) {
	var x = col* this.tilemap.tileWidth;
	var y = row*this.tilemap.tileHeight;
	
	if(centered !== undefined) {
		x += parseInt(this.tilemap.tileWidth/2);
		y += parseInt(this.tilemap.tileHeight/2);
	}
	
	return {'x': x, 'y': y};
}

/*
 * Get tile index from column and row values
 * @param int col column, starting from 0
 * @param int row row, starting from 0
 * @return int index
 */
GameMap.prototype.getIndexFromCell = function(col, row) {
	return row*this.tilemap.tileCountX + col; 
}

/*
 * Get tile index from x, y map coordinates
 * @param int x position in the map
 * @param int y position in the map 
 * @return int index
 */
GameMap.prototype.getIndexFromMapXY = function(x,y) {
	var cell = this.getCellFromMapXY(x,y);
	return this.getIndexFromCell(cell.col,cell.row);
}

/*
 * Check if the cell located in coordinates x, y is blocked
 * @param float x position in the map
 * @param float y position in the map
 * @return boolean
 */
GameMap.prototype.isBlocked = function(x,y) {
	
	//true if out of borders
	if(x>=this.tilemap.width || x < 0 || y >= this.tilemap.height || y < 0)
		return true;
	
	var index = this.getIndexFromMapXY(x,y);
	
	Ti.API.info('index:'+index+' blocked result is:'+(this.blockedIndexes.indexOf(index) != -1));
	Ti.API.info('x:'+x+' y:'+y);
	
	return this.blockedIndexes.indexOf(index) != -1;
}

/*
 * Get all the indexes of blocking tiles
 */
GameMap.prototype.updateBlockingElements = function() {
	this.blockedIndexes = new Array();
	var tiles = this.blockedmap.tiles; 
	var tileCount =  this.blockedmap.tileCount;
	
	for(i=0;i<tileCount;i++) {
		//Ti.API.info(tiles[i]);
		if(tiles[i] == this.blocked_id) {
			this.blockedIndexes.push(i);
		}
	}
}

/*
 * Get cell corner x,y coordinates from map x,y contained inside the cell
 * @param int x
 * @param int y
 * @return Object
 * 
 */
GameMap.prototype.getCellXYFromMapXY = function(x,y) {
	cell = this.getCellFromMapXY(x,y);
	//Ti.API.info('col:'+cell.col+' row:'+cell.row);
	return this.getMapXYFromCell(cell.col,cell.row);
}

/*
 * Center map the given map coordinates
 * @param float x map coordinate
 * @param float y map coordinate
 */
GameMap.prototype.centerToMapXY = function(x,y) {
	var transform_camera = quicktigame2d.createTransform();

	transform_camera.duration = 1000;
        
	transform_camera.lookAt_eyeX = x;
	transform_camera.lookAt_eyeY = y;

	transform_camera.lookAt_centerX = x;
	transform_camera.lookAt_centerY = y;

	this.camera_dx = x-this.gameView.screen.width/2;
	this.camera_dy = y-this.gameView.screen.height/2;

	Ti.API.info('camera_dx:'+this.camera_dx+' camera_dy:'+this.camera_dy);

	this.gameView.moveCamera(transform_camera);
}


module.exports = GameMap;