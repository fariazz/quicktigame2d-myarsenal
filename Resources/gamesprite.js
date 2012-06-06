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
 */
GameSprite.prototype.moveStraight = function(x,y,speed) {
	var transform  = quicktigame2d.createTransform();
	var distance = this.calculateDistance(this.sprite.x,x,this.sprite.y,y);
	transform.duration = parseInt(distance/speed);
	transform.move(x,y);	
	this.sprite.transform(transform);
	
	sprite = this.sprite;
	transform.addEventListener('complete', function(e) {
	  Ti.API.info(sprite.x);
	  Ti.API.info(sprite.y);
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
GameSprite.prototype.calculateDistance = function(x0,y0,x1,y1) {
	return Math.sqrt((x0-x1)^2 + (y0-y1)^2);
}

module.exports = GameSprite;