var map, renderer;
var styleHydrography, styleBounds, styleCities;
var base,statesWMS,statesWFS,tasmaniaWaterBodies,tasmaniaCities,tasmaniaStateBoundaries,lakes;
var selectControl;

function init(){
//OpenLayers.ProxyHost = "proxy.cgi?url=";

	// allow testing of specific renderers via "?renderer=Canvas", etc
    renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

    defineStyles();

    createMap();

    defineSelectControl();

    map.addControl(selectControl);

    selectControl.activate();

}

function createMap(){

    base = new OpenLayers.Layer.WMS("OpenLayers WMS",
        "http://www.ign.es/wms-inspire/ign-base?",
        {layers: "IGNBaseTodo"} 
        );
    statesWMS = new OpenLayers.Layer.WMS("States WMS",
        "http://demo.boundlessgeo.com/geoserver/wms",
        {layers: "topp:states", format: "image/png", transparent: true},
        {maxScale: 15000000}
        );
    statesWFS = new OpenLayers.Layer.Vector("States", {
        styleMap: styleBounds,
        minScale: 15000000,
        strategies: [new OpenLayers.Strategy.BBOX()],
        protocol: new OpenLayers.Protocol.WFS({
            url: "http://demo.boundlessgeo.com/geoserver/wfs",
            featureType: "states",
            featureNS: "http://www.openplans.org/topp"
        }),
        renderers: renderer
    });
    tasmaniaWaterBodies = new OpenLayers.Layer.Vector("Tasmania Water Bodies", {
            //minScale: 15000000,
            styleMap: styleHydrography,
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.WFS({
                url: "http://demo.boundlessgeo.com/geoserver/wfs",
                featureType: "tasmania_water_bodies",
                featureNS: "http://www.openplans.org/topp"
            }),
            renderers: renderer
        });
    tasmaniaCities = new OpenLayers.Layer.Vector("Tasmania Cities", {
            //minScale: 15000000,
            styleMap: styleCities,
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.WFS({
                url: "http://demo.boundlessgeo.com/geoserver/wfs",
                featureType: "tasmania_cities",
                featureNS: "http://www.openplans.org/topp"
            }),
            renderers: renderer
        });
    tasmaniaStateBoundaries = new OpenLayers.Layer.Vector("Tasmania State Boundaries", {
            //minScale: 15000000,
            styleMap: styleBounds,
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.WFS({
                url: "http://demo.boundlessgeo.com/geoserver/wfs",
                featureType: "tasmania_state_boundaries",
                featureNS: "http://www.openplans.org/topp"
            }),
            renderers: renderer
        });
    lakes = new OpenLayers.Layer.Vector("Lakes", {
            //minScale: 15000000,
            styleMap: styleHydrography,
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.WFS({
                url: "http://demo.boundlessgeo.com/geoserver/wfs",
                featureType: "ne_10m_lakes",
                featureNS: "http://boundlessgeo.com"
            }),
            renderers: renderer
        });

    map = new OpenLayers.Map({
        div: "map",
        layers: [base,statesWMS,statesWFS,tasmaniaWaterBodies,tasmaniaCities,tasmaniaStateBoundaries,lakes],
        controls:[
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.PanZoom(),
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.KeyboardDefaults(),
        new OpenLayers.Control.LayerSwitcher()
        ],
        center: [0, 0],
        zoom: 2
    });

}

function defineSelectControl(){

    selectControl = new OpenLayers.Control.SelectFeature(
        [statesWFS,tasmaniaWaterBodies,tasmaniaCities,tasmaniaStateBoundaries,lakes],
        {
            clickout: true, toggle: false,
            multiple: false, hover: false,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "shiftKey" // shift key adds to selection
                }
                );

}

function defineStyles(){

    var selectStyle = new OpenLayers.Style({
        fillColor: 'blue',
        fillOpacity: '0.4',
        strokeColor: 'blue'
    });

    styleHydrography = new OpenLayers.StyleMap({
        'default': {fillColor: '#0055ee',
        fillOpacity: '0.4',
        strokeColor: '#0055ee'},
        'select': selectStyle
    });

    styleBounds = new OpenLayers.StyleMap({
        'default': {fillColor: 'red',
        fillOpacity: '0.4',
        strokeColor: 'red'},
        'select': selectStyle
    });

    styleCities = new OpenLayers.StyleMap({
        'default': {fillColor: 'black',
        strokeColor: 'black',
        pointRadius: '5'},
        'select': selectStyle
    });


}