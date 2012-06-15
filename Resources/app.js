var window = Ti.UI.createWindow({backgroundColor:'black'});

// Obtain game module
var quicktigame2d = require('com.googlecode.quicktigame2d');
var fariazz = {};
fariazz.GameSprite = require('/gamesprite');
fariazz.GameMap = require('/gamemap');

// Create view for your game.
// Note that game.screen.width and height are not yet set until the game is loaded
var gameView = quicktigame2d.createGameView();

gameView.orientation = Ti.UI.PORTRAIT;

// Frame rate can be changed (fps can not be changed after the game is loaded)
gameView.fps = 30;

// set initial background color to black
gameView.color(0, 0, 0);

gameView.debug = true;

// Create game scene
var scene = quicktigame2d.createScene();


//load map files
var GRAPHICS_DIR = 'graphics/';
var mapfile = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, GRAPHICS_DIR + 'biggermap.json');
var mapjson = JSON.parse(mapfile.read().toString());

var mapinfo = {
	image:GRAPHICS_DIR + mapjson.tilesets[0].image,
	tileWidth:mapjson.tilesets[0].tilewidth,
	tileHeight:mapjson.tilesets[0].tileheight,
	border:mapjson.tilesets[0].spacing,
	margin:mapjson.tilesets[0].margin
};

// create map layer
var map = new fariazz.GameMap();
map.tilemap = quicktigame2d.createMapSprite(mapinfo);
map.tilemap.width  = map.tilemap.tileWidth  * mapjson.layers[0].width;
map.tilemap.height = map.tilemap.tileHeight * mapjson.layers[0].height;
map.tilemap.firstgid = mapjson.tilesets[0].firstgid; // tilemap id is started from 'firstgid'
map.tilemap.tiles = mapjson.layers[0].data;

map.blockedmap = quicktigame2d.createMapSprite(mapinfo);
map.blockedmap.width  = map.blockedmap.tileWidth  * mapjson.layers[0].width;
map.blockedmap.height = map.blockedmap.tileHeight * mapjson.layers[0].height;
map.blockedmap.firstgid = mapjson.tilesets[0].firstgid; // tilemap id is started from 'firstgid'
map.blockedmap.tiles = mapjson.layers[1].data;

map.blocked_id = 58;
map.updateBlockingElements();

//create player
var player = new fariazz.GameSprite();
player.gameMap = map;
player.sprite = quicktigame2d.createSprite({image:GRAPHICS_DIR+'player.png'});
player.sprite.x = 32;
player.sprite.y = 32;


// set z-order
map.tilemap.z  = 0;
map.player = player;
map.gameView = gameView;

scene.add(map.tilemap);
scene.add(player.sprite);

// add your scene to game view
gameView.pushScene(scene);

gameView.WINDOW_SCALE_FACTOR_X = 1;
gameView.WINDOW_SCALE_FACTOR_Y = 1;

// Onload event is called when the game is loaded.
// The game.screen.width and game.screen.height are not yet set until this onload event.
gameView.addEventListener('onload', function(e) {
	
	// set screen size for your game (non-retina size)
	var screenScale = gameView.size.width / 320;
	gameView.screen = {width:gameView.size.width / screenScale, height:gameView.size.height / screenScale};
	
	gameView.WINDOW_SCALE_FACTOR_X = gameView.screen.width  / gameView.size.width;
    gameView.WINDOW_SCALE_FACTOR_Y = gameView.screen.height / gameView.size.height;
	
    // Start the game
    gameView.start();
    
    //map.centerToPlayer();
});

gameView.addEventListener('touchstart', function(e) {
	//Ti.API.info('x0: '+e.x*gameView.WINDOW_SCALE_FACTOR_X);
	//Ti.API.info('y0: '+e.y*gameView.WINDOW_SCALE_FACTOR_Y);
	var speed = 0.1;
	
	//get cell that was click and move to the top left corner
	var x = e.x*gameView.WINDOW_SCALE_FACTOR_X;
	var y = e.y*gameView.WINDOW_SCALE_FACTOR_Y;
	
	Ti.API.info('touched x:'+x+' touched y:'+y);
	
	var cell = map.getCellFromScreenXY(x,y);
	var coord = map.getMapXYFromCell(cell.col, cell.row);
	
	//if(player.isMoving === false) {
		player.moveStraightCheck(coord.x,coord.y,speed);
	//}
	
	var index = map.getIndexFromCell(cell.col,cell.row);
	//Ti.API.info('index:'+index);
	
	var tile = map.tilemap.getTile(index);
	Ti.API.info(JSON.stringify(tile));
	
	//map.centerToPlayer();
	
});


// load debug functions
Ti.include("debug.js");

// Add your game view
window.add(gameView);
window.open({fullscreen:true, navBarHidden:true});
