
var map;
var layer;

function init(){

    var mapOptions = {
        maxExtent: new OpenLayers.Bounds(-174,18.4,-63.5,71),
        maxResolution: 0.25,
        projection: "EPSG:4326"};

        map = new OpenLayers.Map('map', mapOptions );

        layer = new OpenLayers.Layer.ArcGIS93Rest( "ArcGIS Server Layer",
            "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/MapServer/export", 
            {layers: "show:0"});

        map.addLayer(layer);

        map.addControl( new OpenLayers.Control.MousePosition() );

        map.setCenter(new OpenLayers.LonLat(-115, 45), 0);
    }
