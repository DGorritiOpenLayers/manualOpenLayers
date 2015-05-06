var map, wmsLayer, marker, popup, vectorLayer, pointStyle, dynamicPointsLayer, panel;
var icon, size, offset;
var controls = [], layers = [], pointList = [], features = [], btnControls = [];
var center, centerLat = 43.298693, centerLong = -2.256916, startZoom = 15;
var pointFeature, lineFeature, polygonFeature;
var drawPoint;
var bDrawing = false;

function init(){

	map = new OpenLayers.Map('map',{controls:[]});

	center = new OpenLayers.LonLat(centerLong,centerLat);

	addButtons();
	addControlsToArray();
	addLayersToArray();
	addFeaturesToArray();
	addMarker();
	addPointDrawer();

	vectorLayer.addFeatures(features);
	map.addLayers(layers);
	map.addControls(controls);

	map.setCenter(center,startZoom);

	zoomEndHandler("zoomend");
	drawPoint.deactivate();

	map.events.register("mousemove",map,mouseMoveHandler);
	map.events.register("mouseover",map,mouseOverHandler);
	map.events.register("mouseout",map,mouseOutHandler);
	map.events.register("zoomend",map,zoomEndHandler);
	marker.events.register("click",marker,markerClick);

}

function addControlsToArray(){

	controls.push(new OpenLayers.Control.Attribution());
	controls.push(new OpenLayers.Control.PanZoom());
	controls.push(new OpenLayers.Control.Navigation());
	controls.push(new OpenLayers.Control.KeyboardDefaults());
	controls.push(new OpenLayers.Control.Scale());
	controls.push(new OpenLayers.Control.LayerSwitcher());
	controls.push(panel);

}

function addLayersToArray(){

	wmsLayer = new OpenLayers.Layer.WMS("Mapa Base",
		"http://www.ign.es/wms-inspire/ign-base?",
		{layers: 'IGNBaseTodo', projection: 'EPSG:4326'} );

	marker = new OpenLayers.Layer.Markers("Markers");

	vectorLayer = new OpenLayers.Layer.Vector("Vector Features");

	dynamicPointsLayer = new OpenLayers.Layer.Vector("Dynamic Points");

	layers.push(wmsLayer);
	layers.push(vectorLayer);
	layers.push(dynamicPointsLayer);
	layers.push(marker);

}

function addMarker(){

	size = new OpenLayers.Size(21,28);
	offset = new OpenLayers.Pixel(-(size.w/2),-size.h);
	icon = new OpenLayers.Icon("https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Azure.png",size,offset);
	marker.addMarker(new OpenLayers.Marker(center,icon));

}

function addFeaturesToArray(){

	createPointFeature();
	createLineFeature();
	createPolygonFeature();

	features.push(pointFeature);
	features.push(lineFeature);
	features.push(polygonFeature);

}

function addPointDrawer(){

	drawPoint = new OpenLayers.Control.DrawFeature(dynamicPointsLayer,OpenLayers.Handler.Point);
	drawPoint.featureAdded = featureAdded;
	controls.push(drawPoint);

}

function addButtons(){

	var el = OpenLayers.Util.getElement('panel');

	panel = new OpenLayers.Control.Panel({'div':el});

	btnActivateDrawing = new OpenLayers.Control.Button({
		displayClass: "activateDrawing", 
		trigger: activateDrawing
	});

	btnControls.push(btnActivateDrawing);

	panel.addControls(btnActivateDrawing);

}

function mouseMoveHandler(evt) {
	var el = document.getElementById("coordinates");
	var pos=this.events.getMousePosition(evt);
	el.value=map.getLonLatFromPixel(pos);
}

function mouseOverHandler(evt) {
	document.getElementById("txt3").style.backgroundColor = "green";	
}

function mouseOutHandler(evt) {
	document.getElementById("txt3").style.backgroundColor = "red";
}

function markerClick(evt) {

	var position = this.events.getMousePosition(evt);
	var lonlat = evt.object.lonlat;
	if(popup == null){
		popup = new OpenLayers.Popup("popup", lonlat,
			new OpenLayers.Size(260,225),
			"<span style='color: black; font-weight: bold;'>Itzurun Taberna</span><br/>"+
			"<iframe width='260' height='190' src='https://www.youtube.com/embed/AqrKHsgU374' frameborder='0' allowfullscreen></iframe>",
			true);
		popup.setBackgroundColor("green");
		popup.setBorder("1px solid green");
		map.addPopup(popup);
	}else{
		popup.toggle();
	}
	OpenLayers.Event.stop(evt);
}

function zoomEndHandler(evt){
	var el = document.getElementById("scale");
	el.value = "SCALE: 1/" + (Math.round(map.getScale() * 1000) / 1000);
}

function createPointFeature(){
	setPointStyle();
	var point = new OpenLayers.Geometry.Point(centerLong,centerLat);
	pointFeature = new OpenLayers.Feature.Vector(point,null,pointStyle);
}

function createLineFeature(){

	pointList = [];
	var point = new OpenLayers.Geometry.Point(centerLong,centerLat);
	for(var p=0; p<10; ++p) {
		point = new OpenLayers.Geometry.Point(
			point.x + Math.random(1)/1000,
			point.y + Math.random(1)/1000);
		pointList.push(point);
	}
	lineFeature = new OpenLayers.Feature.Vector(
		new OpenLayers.Geometry.LineString(pointList));

}

function createPolygonFeature(){

	pointList = [];
	var point = new OpenLayers.Geometry.Point(centerLong,centerLat);
	for(var p=0; p<6; ++p) {
		var a = p * (2 * Math.PI) / 7;
		var r = Math.random(1) + 1;
		var point =
		new OpenLayers.Geometry.Point(
			point.x + (r * Math.cos(a))/1000,
			point.y + (r * Math.sin(a))/1000);
		pointList.push(point);
	}
	pointList.push(pointList[0]);

	var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
	polygonFeature = new OpenLayers.Feature.Vector(
		new OpenLayers.Geometry.Polygon([linearRing]));

}

function setPointStyle(){

	pointStyle = OpenLayers.Util.extend({},OpenLayers.Feature.Vector.style['default']);

	pointStyle.graphicName = "star";
	pointStyle.graphicOpacity = 1;
	pointStyle.pointRadius = 20;
	pointStyle.rotation = -15;
	pointStyle.fillColor = "#ffa500";
	pointStyle.fillOpacity = 0.4;
	pointStyle.strokeColor = "#000011";
	pointStyle.strokeWidth = 2;
	pointStyle.strokeLinecap = "butt";
	pointStyle.label = "Itzurun Taberna";

}

function activateDrawing(){
	
	if (bDrawing){
		bDrawing = false;
		drawPoint.deactivate();
	}else{
		bDrawing = true;
		drawPoint.activate();
	}
	
}