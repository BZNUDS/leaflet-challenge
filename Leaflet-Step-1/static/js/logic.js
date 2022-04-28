// As my starter code, I referenced much of Lesson 15.1.10 for logic.js, index.html and style.css since it was so similar
// However, I then added Depth of the earthquake as well as created a color pallet and legend using some of what we learned on 15.3.2

// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
  console.log("called createMap with data.features");
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
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Creat an overlays object.

  var overlayMaps = {
    quakes: quakeLayer,
  };
  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, quakeLayer]
  });

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Based on 'better' ideas from Eli on 4/9/22
  let infolegend = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend".
  infolegend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map.
  infolegend.addTo(myMap);

  // Tried differnet colors based on https://www.w3schools.com/colors/colors_names.asp and I thought the following were very close if not exact
  document.querySelector(".legend").innerHTML = [
    '<i style="background: Lime"></i><span>-10-10</span><br>',
    '<i style="background: GreenYellow"></i><span>10-30</span><br>',
    '<i style="background: Gold"></i><span>30-50</span><br>',
    '<i style="background: Orange"></i><span>50-70</span><br>',
    '<i style="background: DarkOrange"></i><span>70-90</span><br>',
    '<i style="background: Red"></i><span>90+</span><br>',
  ].join("");

}

function pick_fillColor(depth){
  if ( depth <= 10) {
    return "Lime";    // Default fillcolor for Depth values less 10
  } else if (depth <= 30) {
    return "GreenYellow"
  } else if (depth <= 50) {
    return "Gold"
  } else if (depth <= 70) {
    return "Orange"
  } else if (depth <= 90) {
    return "DarkOrange"
  } else if (depth > 90) {
    return "Red"
  }
}