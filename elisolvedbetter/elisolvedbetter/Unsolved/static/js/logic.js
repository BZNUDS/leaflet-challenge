let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;

// Adding the tile layer
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let url="https://gbfs.citibikenyc.com/gbfs/en/station_information.json";
// Create the createMap function.

let statusUrl = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json";

let icons = {
  COMING_SOON: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  EMPTY: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  OUT_OF_ORDER: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "blue-dark",
    shape: "penta"
  }),
  LOW: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
  NORMAL: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
  })
};

let updatedAt;

let layers = {
  COMING_SOON: new L.LayerGroup(),
  EMPTY: new L.LayerGroup(),
  LOW: new L.LayerGroup(),
  NORMAL: new L.LayerGroup(),
  OUT_OF_ORDER: new L.LayerGroup()
};

let counts = {
  COMING_SOON: 0,
  EMPTY: 0,
  LOW: 0,
  NORMAL: 0,
  OUT_OF_ORDER: 0
};

let baseMaps = {
  "Streets": streets
};

let overlayMaps = {
  "Coming Soon": layers.COMING_SOON,
  "Empty": layers.EMPTY,
  "Low": layers.LOW,
  "Normal": layers.NORMAL,
  "OOO": layers.OUT_OF_ORDER
};

let stations = [];

function processStations(data) {
  stations = data.data.stations;
  updatedAt = data.last_updated;
  d3.json(statusUrl).then(processStatus);
}

function processStatus(status) {
    let info = status.data.stations;
    for(let i = 0; i < stations.length; i++) {
      let station = Object.assign({}, info[i], stations[i]);
      let statusCode;
      if (station.is_installed == false) {
        statusCode = "COMING_SOON";
      } else if(station.num_bikes_available === 0) {
        statusCode = "EMPTY";
      } else if(station.is_installed == true && station.is_renting == false) {
        statusCode = "OUT_OF_ORDER";
      } else if(station.num_bikes_available < 5) {
        statusCode = "LOW";
      } else {
        statusCode = "NORMAL";
      }
      if (statusCode) {
        counts[statusCode] = counts[statusCode] + 1;
        let marker = L.marker([station.lat, station.lon], {
          icon: icons[statusCode]
        }).bindPopup(`<h3>${station.name}: ${station.capacity}</h3>`);
        marker.addTo(layers[statusCode]);
      }
    }

    let myMap = L.map("map", {
      center: newYorkCoords,
      zoom: mapZoomLevel,
      layers: [streets,
         layers.COMING_SOON,
          layers.EMPTY,
          layers.LOW,
          layers.NORMAL,
          layers.OUT_OF_ORDER]
    });

    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

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
    let stationCount = counts;
    document.querySelector(".legend").innerHTML = [
      "<p>Updated: " + moment.unix(updatedAt).format("h:mm:ss A") + "</p>",
      "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
      "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
      "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
      "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
      "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
    ].join("");
}

d3.json(url).then(processStations);