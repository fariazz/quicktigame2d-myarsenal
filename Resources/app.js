var window = Ti.UI.createWindow({backgroundColor:'black'});

// Obtain game module
var quicktigame2d = require('com.googlecode.quicktigame2d');
var fariazz = {};
fariazz.GameSprite = require('/gamesprite');

// Create view for your game.
// Note that game.screen.width and height are not yet set until the game is loaded
var game = quicktigame2d.createGameView();

// Frame rate can be changed (fps can not be changed after the game is loaded)
game.fps = 30;

// set initial background color to black
game.color(0, 0, 0);

game.debug = true;

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
game.pushScene(scene);

// Onload event is called when the game is loaded.
// The game.screen.width and game.screen.height are not yet set until this onload event.
game.addEventListener('onload', function(e) {
	
	// set screen size for your game (non-retina size)
	var screenScale = game.size.width / 320;
	game.screen = {width:game.size.width / screenScale, height:game.size.height / screenScale};
	
    // Start the game
    game.start();
});

game.addEventListener('touchstart', function(e) {
	Ti.API.info(e.x);
	Ti.API.info(e.y);
	player.moveStraight(e.x,e.y,0.01);
	
});


// load debug functions
Ti.include("debug.js");

// Add your game view
window.add(game);
window.open({fullscreen:true, navBarHidden:true});
