# leaflet-challenge
# # My files can be found at https://github.com/BZNUDS/leaflet-challenge
# I completed the required section and stored it in the folder called "Leaflet-Step-1"
# Please feel free to reach out to me directly if you have any questions.
# Thank you,
# Brian Zdarsky


In this assignment, I creatied three files (index.html, logic.js, style.css) to do basic visulization on a OpenStreetMap of earthquake magnitutde and depth data using the data that is updated ever at http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
 
Lucky for us, the USGS provides this earthquake data in a number of different formats, updated every 5 minutes. Visiting the USGS GeoJSON Feed page and pick the data set "All Earthquakes from the Past 7 Days". This gave me a JSON representation of that data. I used the URL of this JSON to pull in the data for our visualization.

I imported and then visualized the earthquake data set by creating a map using Leaflet that plots all of the earthquakes based on their longitude and latitude.

My data markers reflect the magnitude of the earthquake by their size and and depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color. The depth of the earth was determined by using the third coordinate for each earthquake.

I included popups that provide additional information about the earthquake when a marker is clicked.

My leaflet map has a layers icon in the top right corner that allows the user to select/deselect 
    1) Streetmap
    2) Topographic Map
    3) quakes

I created a legend that will provide context for your map data.

My visualization is supposed to look something like the map provided in the Homework assignment instructions...and I think it does:)

I did have one concern regarding the 7 messages that occur sometimes, so I did a AskBCS request. The Learning Assistant Monali told me it is a Chrome issue and is not an error with my assignment. (see ask-145453 channel for more details)

Please feel free to reach out to me directly if you have any questions.

Thank you,

Brian Zdarsky