var window = Ti.UI.createWindow({backgroundColor:'black'});

// Obtain game module
var quicktigame2d = require('com.googlecode.quicktigame2d');
var fariazz = {};
fariazz.GameSprite = require('/gamesprite');

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
var mapfile = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, GRAPHICS_DIR + 'map.json');
var mapjson = JSON.parse(mapfile.read().toString());

var mapinfo = {
	image:GRAPHICS_DIR + mapjson.tilesets[0].image,
	tileWidth:mapjson.tilesets[0].tilewidth,
	tileHeight:mapjson.tilesets[0].tileheight,
	border:mapjson.tilesets[0].spacing,
	margin:mapjson.tilesets[0].margin
};

// create map layer
var map = quicktigame2d.createMapSprite(mapinfo);

map.width  = map.tileWidth  * mapjson.layers[0].width;
map.height = map.tileHeight * mapjson.layers[0].height;

map.firstgid = mapjson.tilesets[0].firstgid; // tilemap id is started from 'firstgid'
map.tiles = mapjson.layers[0].data;

//create player
var player = new fariazz.GameSprite();
player.sprite = quicktigame2d.createSprite({image:GRAPHICS_DIR+'player.png'});
player.sprite.x = 100;
player.sprite.y = 100;


// set z-order
map.z  = 0;

scene.add(map);
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
});

gameView.addEventListener('touchstart', function(e) {
	//Ti.API.info('x0: '+e.x*gameView.WINDOW_SCALE_FACTOR_X);
	//Ti.API.info('y0: '+e.y*gameView.WINDOW_SCALE_FACTOR_Y);
	speed = 0.1;
	player.moveStraight(e.x*gameView.WINDOW_SCALE_FACTOR_X,e.y*gameView.WINDOW_SCALE_FACTOR_Y,speed,true);
	
});


// load debug functions
Ti.include("debug.js");

// Add your game view
window.add(gameView);
window.open({fullscreen:true, navBarHidden:true});
