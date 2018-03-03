var url = "leaflet_deaths_miles";

var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2VsbHkxMXoiLCJhIjoiY2pkaGt5OXVkMHd1eTMzcmxjYmhyc3NoNiJ9.Avx35dP2zqEGO04bmS6UNw", {
    id: 'mapbox.light'

}).addTo(map);



Plotly.d3.json(url, function (error, response) {

    console.log(response);

    L.geoJson(response, {
        style: style
    }).addTo(map);

        
    geojson = L.geoJson(response, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);


});



function getColor(d) {
    return         d > 23.1 ?  '#a50f15'  :
        d > 15.32 ? '#de2d26' :
        d > 12.25 ? '#fb6a4a' :
        d > 9.225 ? '#fcae91' :
        '#fee5d9';
 }

function style(feature) {
    return {
        fillColor: getColor(feature.properties.deaths),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Death Per Population (10,000)</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.deaths + ' death / Population (10,000) '
        : 'Hover over a state');
};

info.addTo(map);

