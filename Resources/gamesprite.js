/*
 * quicktigame2d-myarsenal.GameSprite
 * 
 * Extends the sprite provided by quicktigame2d
 */

var quicktigame2d = require('com.googlecode.quicktigame2d');

GameSprite = function() {
	this.sprite = {};
	this.gameMap = {};
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
 *	Move in a straigh line between to the target coordinates
 * @param int x position in the map
 * @param int y position in the map 
 * @param float speed in pixel/milisecond
 * @param boolean centered , if true the center of the sprite goes in the target coordinates
 */
GameSprite.prototype.moveStraight = function(x,y,speed,centered) {
	var transform  = quicktigame2d.createTransform();
	
	if(centered !== undefined) {
		x -= this.sprite.width/2;
		y -= this.sprite.height/2;
	}
	
	var distance = this.calculateDistance(this.sprite.x,x,this.sprite.y,y);
	
	Ti.API.info('distance: '+distance);
	
	
	transform.duration = parseInt(distance/speed);
	
	Ti.API.info('duration: '+transform.duration);
	
	transform.move(x,y);	
	this.sprite.transform(transform);
	
	sprite = this.sprite;
	transform.addEventListener('complete', function(e) {
	  //Ti.API.info(sprite.x);
	  //Ti.API.info(sprite.y);
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
	var dx = x - this.sprite.x;
	var dy = y - this.sprite.y;
	var delta = this.sprite.width;
	var sin_alfa = dy / (Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
	var cos_alfa = dx / (Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
	
	var delta_y = delta*sin_alfa;
	var delta_x = delta*cos_alfa;
	
	var step = this.gameMap.tilemap.tileWidth;
	var was_blocked = false;
	var distance =  this.calculateDistance(this.sprite.x,x,this.sprite.y,y);
	for(i=0;i<distance;i=i+delta) {
		
		current_x = this.sprite.x + cos_alfa * i;
		current_y = this.sprite.y + sin_alfa * i;
		
		current_x_check = dx > 0 ? current_x+this.sprite.width-1+delta_x : current_x;
		current_y_check = dy > 0 ? current_y+this.sprite.height-1+delta_y : current_y;
		
		//check x
		for(j=0;j<this.sprite.height;j = j+step) {
			if(this.gameMap.isBlocked(current_x_check, current_y+j)) {
				was_blocked = true;
				break;						
			}
		}
		
		//check y
		for(j=0;j<this.sprite.width;j = j+step) {
			if(this.gameMap.isBlocked(current_x+j, current_y_check)) {
				was_blocked = true;
				break;			
			}
		}
		
		//check diagonal
		if(this.gameMap.isBlocked(current_x_check, current_y_check)) {
			was_blocked = true;
			break;			
		}	
		
		Ti.API.info('not blocked!');
	}
	
	if(i) {
		if(was_blocked)
			this.moveStraight(this.sprite.x + cos_alfa * i,this.sprite.y + sin_alfa * i,speed);	
		else
			this.moveStraight(x,y,speed);
	}
}

module.exports = GameSprite;