
    
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
"T6YbdDixkOBWH_k9GbS8JQ");
 var outdoor2 = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
"T6YbdDixkOBWH_k9GbS8JQ");
    
    var queryUrl = "accidents_map";
	
var myMap = L.map("mapid", {
    center: [
      37.8, -96
    ],
    zoom: 4,
    layers : [outdoors,outdoor2]
  });
  

  var baseMaps = {
    "outdoor": outdoors,
    "outdoor2": outdoor2
};


  
d3.json(queryUrl, function(response) {
  var markers = L.markerClusterGroup();

  for (var i = 0; i < response.length; i++) {
  

   
      markers.addLayer(L.marker([response[i].latitude,response[i].longitude])
        .bindPopup("<p style=`font-size:1.5em`> <b>Case Id:</b> " + response[i].case_id + "</p><p style=`font-size:1.5em`><b>Case Date: </b>" + response[i].date + "</p><p style=`font-size:1.5em`><b>Number of Drunk Drivers Involved:</b> " + response[i].drunk_drivers + "</p><p style=`font-size:1.5em`><b>Number of Fatalities: </b>" + response[i].fatalities + "</p>"));
    }

	var overlayMaps = {
    "Markers": markers
};
	
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
var baseMaps = {
    "<span style='color: gray'>Grayscale</span>": outdoors,
    "Streets": outdoor2
};
});