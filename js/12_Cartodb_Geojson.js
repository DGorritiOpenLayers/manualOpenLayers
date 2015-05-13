function init(){
    var map = new OpenLayers.Map({
        div: "map",
        layers: [
        new OpenLayers.Layer.OSM(),
        new OpenLayers.Layer.Vector("Costa Rica", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.Script({
                url: "http://examples.cartodb.com/api/v2/sql",
                params: {
                    q: "select * from costa_rica_pa LIMIT 50",
                    format: "geojson"
                },
                format: new OpenLayers.Format.GeoJSON({
                    ignoreExtraDims: true
                }),
                callbackKey: "callback"
            })/*,
            eventListeners: {
                "featuresadded": function() {
                    this.map.zoomToExtent(this.getDataExtent());
                }
            }*/
        }),
        new OpenLayers.Layer.Vector("Tornado Centroids", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.Script({
                url: "http://examples.cartodb.com/api/v2/sql",
                params: {
                    q: "select * from tornado_centroids limit 100",
                    format: "geojson"
                },
                format: new OpenLayers.Format.GeoJSON({
                    ignoreExtraDims: true
                }),
                callbackKey: "callback"
            })/*,
            eventListeners: {
                "featuresadded": function() {
                    this.map.zoomToExtent(this.getDataExtent());
                }
            }*/
        })
        ]
    });

     map.setCenter(new OpenLayers.LonLat(0, 0), 0);
}