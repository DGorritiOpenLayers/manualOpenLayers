var map, wmsLayer, marker, popup, vectorLayer, pointStyle, dynamicPointsLayer, panel;
var icon, size, offset;
var controls = [], layers = [], pointList = [], features = [], btnControls = [];
var center, centerLat = 43.298693, centerLong = -2.256916, startZoom = 15;
var pointFeature, lineFeature, polygonFeature, boxFeature;
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

function activateDrawing(){

	var color, backgroundImage, disabled;
	var button = document.getElementsByClassName("activateDrawingItemInactive");
	var panel = document.getElementsByClassName("myPanel");
	var combo = document.getElementById("comboDrawingType");

	if (bDrawing){
		bDrawing = false;
		backgroundImage = "url('https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-part-2/512/turn_on_off_power-128.png')";
		color = "red";
		disabled = true;
		drawPoint.deactivate();
	}else{
		bDrawing = true;
		backgroundImage = "url('http://png-3.findicons.com/files/icons/1620/crystal_project/128/exit.png')";
		color = "green";
		disabled = false;
		drawPoint.activate();
	}

	button[0].style.backgroundImage = backgroundImage;
	panel[0].style.backgroundColor = color;
	combo.disabled = disabled;

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

function addControlsToArray(){

	controls.push(new OpenLayers.Control.Attribution());
	controls.push(new OpenLayers.Control.PanZoom());
	controls.push(new OpenLayers.Control.Navigation());
	controls.push(new OpenLayers.Control.KeyboardDefaults());
	controls.push(new OpenLayers.Control.Scale());
	controls.push(new OpenLayers.Control.LayerSwitcher());
	controls.push(panel);

}

function addFeaturesToArray(){

	createPointFeature();
	createLineFeature();
	createPolygonFeature();
	createBoxFeature();

	features.push(pointFeature);
	features.push(lineFeature);
	features.push(polygonFeature);
	features.push(boxFeature);

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

function addPointDrawer(){

	drawPoint = new OpenLayers.Control.DrawFeature(dynamicPointsLayer,OpenLayers.Handler.Point);

	controls.push(drawPoint);

}

function createBoxFeature(){

	var left = centerLong - 0.01;
	var bottom = centerLat - 0.002;
	var right = left + 0.002;
	var top = bottom + 0.002;

	var box_extent = [left,bottom,right,top];

	var bounds = new OpenLayers.Bounds.fromArray(box_extent);
	boxFeature = new OpenLayers.Feature.Vector(bounds.toGeometry());

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

function createPointFeature(){

	setPointStyle();
	var point = new OpenLayers.Geometry.Point(centerLong,centerLat);
	pointFeature = new OpenLayers.Feature.Vector(point,null,pointStyle);

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

function mouseMoveHandler(evt) {
	var el = document.getElementById("coordinates");
	var pos=this.events.getMousePosition(evt);
	el.value=map.getLonLatFromPixel(pos);
}

function mouseOutHandler(evt) {
	document.getElementById("txt3").style.backgroundColor = "red";
}

function mouseOverHandler(evt) {
	document.getElementById("txt3").style.backgroundColor = "green";	
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

function zoomEndHandler(evt){
	var el = document.getElementById("scale");
	el.value = "SCALE: 1/" + (Math.round(map.getScale() * 1000) / 1000);
}