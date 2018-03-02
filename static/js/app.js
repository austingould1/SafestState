
    
    

    
    var queryUrl = "accidents_map";
var myMap = L.map("mapid", {
    center: [
      37.8, -96
    ],
    zoom: 4,
    
  });
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
"T6YbdDixkOBWH_k9GbS8JQ").addTo(myMap);

d3.json(queryUrl, function(response) {
  var markers = L.markerClusterGroup();

  for (var i = 0; i < response.length; i++) {
    // set the data location property to a variable
    

    // If the data has a locatxion property...
    

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([response[i].latitude,response[i].longitude])
        .bindPopup(response[i].date));
    }

  

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);
});