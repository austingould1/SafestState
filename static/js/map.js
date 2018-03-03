var queryUrl = "accidents_map";
var access_token = "pk.eyJ1IjoieXVrdW5wZW5nIiwiYSI6ImNqYXNteGJkYjR1dzUyd3BsN3pxdjM1OHYifQ.6OWtaDtRlo_h7U1lhYb-Hg";
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=" + access_token);
var statelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=" + access_token);

// ########################################## 
// Search Functions

//function initialize() {
//    var input = document.getElementById('searchTextField');
//    var autocomplete = new google.maps.places.Autocomplete(input);
//    google.maps.event.addListener(autocomplete, 'place_changed', function() {
//        var place = autocomplete.getPlace();
//        document.getElementById('city2').value = place.name;
//        document.getElementById('cityLat').value = place.geometry.location.lat();
//        document.getElementById('cityLng').value = place.geometry.location.lng();
//
//
//    });
//}

// ########################################## 
// Creating Map Layer and Base Layers





d3.json(queryUrl, function(response) {
  

    
    var markers = L.markerClusterGroup();

    
    
    
    var baseMaps = {
        "<span style='color: gray'>LightMap</span>": lightMap,
        "Statellitemap": statelliteMap
    };
    var overlayMaps = {
        "Accidents": markers
    };



  

    for (var i = 0; i < response.length; i++) {
         markers.addLayer(L.marker([response[i].latitude, response[i].longitude]).bindPopup("<p style=`font-size:1.5em`> <b>Case Id:</b> " + response[i].case_id + "</p><p style=`font-size:1.5em`><b>Case Date: </b>" + response[i].date + "</p><p style=`font-size:1.5em`><b>Number of Drunk Drivers Involved:</b> " + response[i].drunk_drivers + "</p><p style=`font-size:1.5em`><b>Number of Fatalities: </b>" + response[i].fatalities + "</p>"));
    }


    var myMap = L.map("mapid", {
        center: [
            37.8, -96
        ],
        zoom: 4,
        layers: [lightMap, statelliteMap,markers]
    });
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

});