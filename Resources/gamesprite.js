/*
 * quicktigame2d-myarsenal.GameSprite
 * 
 * Extends the sprite provided by quicktigame2d
 */

var quicktigame2d = require('com.googlecode.quicktigame2d');

GameSprite = function() {
	this.sprite = {};
	this.gameMap = {};
	this.isMoving = false;
}

/*
 * Initiate GameSprite
 */
GameSprite.prototype.init = function(params) {
	this.sprite = params.sprite;
	this.gameMap = params.gameMap;
	
	//create surrounding blocks for collision detection with blocking objects
	this.surroundTop = quicktigame2d.createSprite(
		{width: this.sprite.width});
player.sprite.x = 100;
player.sprite.y = 100;
}

/*
 *	Move in a straigh line between to the target map coordinates
 * @param int x position in the map
 * @param int y position in the map 
 * @param float speed in pixel/milisecond
 * @param boolean centered , if true the center of the sprite goes in the target coordinates
 */
GameSprite.prototype.moveStraight = function(x,y,speed,centered) {
	var transform  = quicktigame2d.createTransform();
	
	Ti.API.info('moveStraight x:'+x+' y:'+y);
	
	if(centered !== undefined) {
		x -= this.sprite.width/2;
		y -= this.sprite.height/2;
	}
	
	var distance = this.calculateDistance(this.sprite.x,x,this.sprite.y,y);
	
	Ti.API.info('distance: '+distance);
	
	
	transform.duration = parseInt(distance/speed);
	
	//Ti.API.info('duration: '+transform.duration);
	
	transform.move(x,y);
	this.isMoving = true;	
	
	Ti.API.info('sprite position prior movement. x:'+this.sprite.x+' y:'+this.sprite.y);
	
	this.sprite.transform(transform);
	
	var sprite = this;
	var map = this.gameMap;
	
	transform.addEventListener('complete', function(e) {
		
		Ti.API.info('sprite position after movement. x:'+sprite.sprite.x+' y:'+sprite.sprite.y);
		
		sprite.isMoving = false;
		map.centerToMapXY(x,y);
	  	
	  	Ti.API.info('sprite position after camera movement. x:'+sprite.sprite.x+' y:'+sprite.sprite.y);
	  	
	  	var initial_cell = sprite.getMapXYPosition();
	
	Ti.API.info('map position after camera movement: '+JSON.stringify(initial_cell));
	  	
	});
}

/*
 * Calculate the distance between two points
 * 
 * @param int x0
 * @param int x1
 * @param int y0
 * @param int y1
 */
GameSprite.prototype.calculateDistance = function(x0,x1,y0,y1) {
	
	Ti.API.info('x0:'+x0);
	Ti.API.info('x1:'+x1);
	Ti.API.info('y0:'+y0);
	Ti.API.info('y1:'+y1);
	
	return Math.sqrt(Math.pow(x0-x1,2) + Math.pow(y0-y1,2));
}

/*
 * Move in a straight line to the destination or the first blockage
 * @param int x position in the map
 * @param int y position in the map 
 * @param float speed in pixel/milisecond
 */
GameSprite.prototype.moveStraightCheck = function(x,y,speed) {
	//direction
	var initial_cell = this.getMapXYPosition();
	
	Ti.API.info('initial cell: '+JSON.stringify(initial_cell));
	
	var final_cell = this.gameMap.getCellXYFromMapXY(x,y);
	var distance =  this.calculateDistance(initial_cell.x,final_cell.x,initial_cell.y,final_cell.y);
	var delta = Math.min(distance,this.gameMap.tilemap.tileWidth/4);
	
	//Ti.API.info('delta:'+delta);
	
	var dx = x - initial_cell.x;
	var dy = y - initial_cell.y;
	var sin_alfa = dy / distance;
	var cos_alfa = dx / distance;
	
	var delta_y = delta*sin_alfa;
	var delta_x = delta*cos_alfa;
	
	var was_blocked = false;
	
	this.isMoving = true;
	for(i=0;i<distance;i=i+delta) {
		
		var current_y = (initial_cell.y+this.gameMap.tilemap.tileHeight/2) + sin_alfa * i;
		var current_x = (initial_cell.x+this.gameMap.tilemap.tileWidth/2) + cos_alfa * i;
		
		//Ti.API.info('current x:'+(current_x)+'current y:'+(current_y));
		//Ti.API.info('current index:'+this.gameMap.getIndexFromMapXY(current_x,current_y));
				
		//Ti.API.info('target raw x:'+(current_x+delta_x)+'target raw y:'+(current_y+delta_y));
		//Ti.API.info('target raw index:'+this.gameMap.getIndexFromMapXY((current_x+delta_x),(current_y+delta_y)));
		
		var target_cell = this.gameMap.getCellXYFromMapXY(current_x+delta_x,current_y+delta_y);
		
		//check target cell
		if(this.gameMap.isBlocked(target_cell.x, target_cell.y)) {
			was_blocked = true;
			Ti.API.info('blocked');
			break;			
		}	
		
		Ti.API.info('not blocked!');
	}
	
	if(i) {
		if(was_blocked) {
			var current_cell = this.gameMap.getCellXYFromMapXY(current_x,current_y);
			this.moveStraight(current_cell.x,current_cell.y,speed);	 
		}
			
		else {
			//check final cell in case it wasn't checked before'
			if(!this.gameMap.isBlocked(x, y)) {
				this.moveStraight(x,y,speed);
			}
			
			else {
				this.moveStraight(target_cell.x,target_cell.y,speed);
			}
		}
			
	}
}

/*
 * get the position x, y in map coordinates
 * 
 */
GameSprite.prototype.getMapXYPosition = function() {
	return {
		x:this.sprite.x,
		y:this.sprite.y
		}
};

module.exports = GameSprite;