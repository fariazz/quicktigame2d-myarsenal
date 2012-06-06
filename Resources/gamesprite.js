/*
 * quicktigame2d-myarsenal.GameSprite
 * 
 * Extends the sprite provided by quicktigame2d
 */

var quicktigame2d = require('com.googlecode.quicktigame2d');

GameSprite = function() {
	this.sprite = {};
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

module.exports = GameSprite;