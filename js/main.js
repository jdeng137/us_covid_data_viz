// Set your Mapbox access token
mapboxgl.accessToken =
    'pk.eyJ1IjoiamRlbmcxMzciLCJhIjoiY21oY3BwdGxtMW93bDJsb282bnl6bWl0NSJ9.t19u2LlOUGTPHQ7N82CpkA';

// Initialize map with Albers projection
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // dark basemap
    zoom: 4, // starting zoom
    center: [-96, 37.5], // centered on US
    projection: 'albers' // Albers projection as required
});

// Define color grades for COVID rates (cases per 1000 residents)
const grades = [0, 20, 40, 60, 80, 100];
const colors = ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603', '#7a0000'];

// Load data when map loads
map.on('load', () => {
    
    // Add data source
    map.addSource('covid-rates', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.geojson'
    });

    // Add choropleth layer
    map.addLayer({
        'id': 'covid-rates-layer',
        'type': 'fill',
        'source': 'covid-rates',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'], // get the rates property from the data
                colors[0],
                grades[1], colors[1],
                grades[2], colors[2],
                grades[3], colors[3],
                grades[4], colors[4],
                grades[5], colors[5]
            ],
            'fill-opacity': 0.7,
            'fill-outline-color': '#333'
        }
    });

    // Add county borders layer
    map.addLayer({
        'id': 'covid-rates-borders',
        'type': 'line',
        'source': 'covid-rates',
        'paint': {
            'line-color': '#555',
            'line-width': 0.5
        }
    });

    // Click event to show popup with county information
    map.on('click', 'covid-rates-layer', (event) => {
        const properties = event.features[0].properties;
        new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(`
                <strong>${properties.county}, ${properties.state}</strong><br>
                <strong>Rate:</strong> ${properties.rates ? properties.rates.toFixed(2) : 'N/A'} cases per 1,000<br>
                <strong>Total Cases:</strong> ${properties.cases ? properties.cases.toLocaleString() : 'N/A'}<br>
                <strong>Population:</strong> ${properties.pop ? properties.pop.toLocaleString() : 'N/A'}
            `)
            .addTo(map);
    });

    // Change cursor to pointer when hovering over counties
    map.on('mouseenter', 'covid-rates-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change cursor back when leaving counties
    map.on('mouseleave', 'covid-rates-layer', () => {
        map.getCanvas().style.cursor = '';
    });
});

// Create legend
const legend = document.getElementById('legend');

// Set up legend labels
var labels = ['<strong>Cases per 1,000</strong>'];

// Iterate through grades and create a color bar and label for each
for (var i = 0; i < grades.length; i++) {
    var from = grades[i];
    var to = grades[i + 1];
    
    labels.push(
        '<p class="break">' +
        '<span class="color-bar" style="background:' + colors[i] + '"></span>' +
        '<span class="color-label">' + from + (to ? ' &ndash; ' + to : '+') + '</span>' +
        '</p>'
    );
}

// Add data source
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank">NYT</a>, <a href="https://www.census.gov/" target="_blank">US Census</a></p>';

// Combine all the html codes
legend.innerHTML = labels.join('') + source;