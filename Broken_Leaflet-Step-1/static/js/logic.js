// As my starter code, I referenced much of Lesson 15.1.10 for logic.js, index.html and style.css since it was so similar
// However, I then added Depth of the earthquake as well as created a color pallet and legend

// Store our API endpoint as queryUrl.
// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

console.log("entered logic.js");
// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  createMap(data.features);
});


function createMap(earthquakes) {
  let quakeMarkers = [];

  // Loop through locations, and create the earthquake markers.
  for (var i = 0; i < earthquakes.length; i++) {
    // Set the marker radius for the state by passing the population to the markerSize() function.
    quakeMarkers.push(
      L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0], earthquakes[i].geometry.coordinates[2]], {
        stroke: true,
        fillOpacity: 0.75,
        color: "gray", 
        // fillColor: "white",
        fillColor: pick_fillColor(earthquakes[i].geometry.coordinates[2]),  //(pass in depth = earthquakes[i].geometry.coordinates)
        radius: earthquakes[i].properties.mag * 20000 //(magnitutude = earthquakes[i]..properties.mag)
      }).bindPopup(`<h2>${earthquakes[i].properties.place}: ${earthquakes[i].properties.mag} Magnitude, ${earthquakes[i].geometry.coordinates[2]} Depth</h2>`)
    );
  }
  console.log("quakeMarkers", quakeMarkers);
  console.log("earthquakes[0].geometry.coordinates[2]", earthquakes[0].geometry.coordinates[2]);

  let quakeLayer = L.layerGroup(quakeMarkers);
  // Create the base layers.
  console.log("near street =");
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  console.log("near topo =");
  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  console.log("near baseMaps =");
  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Creat an overlays object.
  console.log("near overlayMaps =");
  var overlayMaps = {
    quakes: quakeLayer,
  };


  // // Create a new map.
  // // Edit the code to add the earthquake data to the layers.
  // console.log("near myMap =");
  // var myMap = L.map("map", {
  //   center: [
  //     37.09, -95.71
  //   ],
  //   zoom: 5,
  //   layers: [street, quakeLayer]
  // });


  // // Create a layer control that contains our baseMaps.
  // // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  // console.log("near L.control.layers");
  // L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  // console.log("after L.control.layers");


  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  console.log("near L.control.layers");
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  console.log("after L.control.layers");




}

function pick_fillColor(depth){
  console.log("inside pick_fillColor and depth is",depth);
  if ( depth <= 10) {
    return "Chartreuse";    // Default fillcolor for Depth values less 10
  } else if (depth <= 30) {
    return "GreenYellow"
  } else if (depth <= 50) {
    return "Yellow"
  } else if (depth <= 70) {
    return "Gold"
  } else if (depth <= 90) {
    return "GoldenRod"
  } else if (depth > 90) {
    return "Red"
  }
}