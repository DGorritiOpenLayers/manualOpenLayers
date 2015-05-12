var centerLat = 43.298693, centerLong = -2.256916, startZoom = 5;
var map, controls = [], layers = [];
var WGS84 = new OpenLayers.Projection("EPSG:4326");
var OSMProjection = new OpenLayers.Projection("EPSG:3857");

function init(){

	map = new OpenLayers.Map('map',{
		projection: 'EPSG:3857',
		controls: []
	});
	var center = new OpenLayers.LonLat(centerLong,centerLat);

	center.transform(WGS84,OSMProjection);

	addLayersToArray();
	addControlsToArray();

	map.addLayers(layers);
	map.addControls(controls);

	map.setCenter(center,startZoom);

	map.events.register("click", map , mapClick);

}

function addControlsToArray(){

	controls.push(new OpenLayers.Control.Attribution());
	controls.push(new OpenLayers.Control.PanZoom());
	controls.push(new OpenLayers.Control.Navigation());
	controls.push(new OpenLayers.Control.KeyboardDefaults());
	controls.push(new OpenLayers.Control.LayerSwitcher());

}

function addLayersToArray(){

	
	var OSMlayer = new OpenLayers.Layer.OSM();
	var wmsLayer = new OpenLayers.Layer.WMS("Mapa Base",
		"http://www.ign.es/wms-inspire/ign-base?",
		{layers: 'IGNBaseTodo'} );

	layers.push(OSMlayer);
	layers.push(wmsLayer);

}

function mapClick(evt){
	var pos=this.events.getMousePosition(evt);
	printMessage(map.getLonLatFromPixel(pos).transform(OSMProjection,WGS84));
}

function printMessage(message){
	document.getElementById('textarea').value = message;
}