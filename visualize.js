
var map;
require(["esri/renderers/SimpleRenderer", 
	"esri/InfoTemplate", 
	"esri/graphic",
      "dojo/_base/json",
       "esri/layers/GraphicsLayer", 
       "esri/map",
      "esri/layers/FeatureLayer", 
      "esri/renderers/ClassBreaksRenderer",
      "esri/symbols/SimpleMarkerSymbol", 
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/PictureMarkerSymbol", 
      "dojo/parser", 
      "dojo/_base/array",
      "dojo/_base/Color", 
      "dojo/dom",
      "dojo/on",
       "dojo/date",
      "dijit/layout/BorderContainer", 
      "dijit/layout/ContentPane",
      "dojo/domReady!"
    ], function(SimpleRenderer, InfoTemplate, Graphic, dojoJson,
      GraphicsLayer, Map, FeatureLayer, ClassBreaksRenderer,
      SimpleMarkerSymbol, SimpleLineSymbol, PictureMarkerSymbol, parser,
      arrayUtils, Color, dom, on, date){


	var GEO_ID = "geo";
	var MAX_SAVED_LOCATIONS = 50;

	function position(lat, long) {
		return {longitude: long, latitude: lat};
	}


	var User = function(){
		this.position = {longitude:40.752900, latitude: -73.994192};
		this.positions = [];
	};

	var DataManager= function(user, map){
		this.user = user;
		this.mapmanager = map;
	};

	var MapManager = function(geo_id, startlocation){
		var self = this;
		self.loadMap(geo_id, startlocation);

	};


	MapManager.prototype.generateGraphicForObject = function(thing){
		var geometry = new Point(thing.position.longitude, thing.position.latitude);
		var graphic = new Graphic(geometry);

		return graphic;
	};

	MapManager.prototype.renderGraphicsOnMap = function(graphics) {
		var self = this;
		console.log(self.map.graphics);
		for(var i =0; i < graphics.length; i++) {
			graphic = graphics[i];
			if(graphic) { self.map.graphics.add(graphic); }
		}
	};

	MapManager.prototype.loadMap = function(geo_id, startlocation){
	  var self = this;
	  self.map = new Map(geo_id, {
		    center: [startlocation.latitude, startlocation.longitude],
		    zoom: 15,
		    basemap: "satellite"
	  });
	  self.map.on("load", self.loadGraphics);

	  
	};

	MapManager.prototype.loadGraphics = function(){
	  var self = this;
	 
	};
	DataManager.prototype.positionUpdate = function(position){

		this.user.position = location;
		if(this.user.positions.length > MAX_SAVED_LOCATIONS) this.user.positions.shift();
		this.user.positions.push(position);
		
		var latitude  = position.coords.latitude;
	    var longitude = position.coords.longitude;
	};
	DataManager.prototype.positionError = function(error){

	};

	DataManager.prototype.updateUserPosition = function(){
		var self = this;

		if (!navigator.geolocation){
		    console.log("Geolocation is not supported by your browser");
	    	return;
	  	}
		if ("geolocation" in navigator) {
			  navigator.geolocation.getCurrentPosition(self.positionUpdate, self.positionError);
		} 
	};

	DataManager.prototype.getPlants = function(numPlants){
		return [position(40.753186, -73.993423), position(40.752846, -73.993166), position(40.753543, -73.993457)];
	};

	DataManager.prototype.getPlantGraphics = function(){
		positions = this.getPlants();
		var graphics = [];
		for(var i =0; i < positions.length; i++){
			position = positions[i];
			graphics.push(this.mapmanager.generateGraphicForObject({
				position:positions[i]
			}));
		}

		this.mapmanager.renderGraphicsOnMap(graphics);
	};


	var user = new User();
	var map = new MapManager(GEO_ID, user.position);
	var data = new DataManager(user, map);

	data.getPlantGraphics();
});
