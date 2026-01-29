mapboxgl.accessToken =
'pk.eyJ1IjoiamRlbmcxMzciLCJhIjoiY21oY3BwdGxtMW93bDJsb282bnl6bWl0NSJ9.t19u2LlOUGTPHQ7N82CpkA';

let map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 4, // starting zoom
center: [-96, 37.5], // centered on US
projection: 'albers' // Albers projection as required
});

// Define grades (case counts), colors, and radii for proportional symbols
// Data ranges from 1 to 756,412 cases
const grades = [1000, 5000, 25000, 75000, 150000, 200000, 300000],
colors = ['rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(103,169,207)', 'rgb(54,144,192)', 'rgb(2,56,88)', 'rgb(1,88,70)', 'rgb(1,108,89)'],
radii = [2, 5, 10, 15, 20, 22, 25];

// Load data to the map
map.on('load', () => {
// Add a source of the data
map.addSource('covidCases', {
    type: 'geojson',
    data: 'assets/us-covid-2020-counts.json'
});

// Find the index of the first symbol layer in the map style
const layers = map.getStyle().layers;
let firstSymbolId;
for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
        firstSymbolId = layers[i].id;
        break;
    }
}

// Add layer with proportional symbols BEFORE the first symbol layer
map.addLayer({
    'id': 'covidCases-point',
    'type': 'circle',
    'source': 'covidCases',
    'paint': {
        // Increase the radius of the circle as case count increases
        'circle-radius': {
            'property': 'cases',
            'stops': [
                [grades[0], radii[0]],
                [grades[1], radii[1]],
                [grades[2], radii[2]],
                [grades[3], radii[3]],
                [grades[4], radii[4]],
                [grades[5], radii[5]],
                [grades[6], radii[6]]
            ]
        },
        // Change the color of the circle as case count increases
        'circle-color': {
            'property': 'cases',
            'stops': [
                [grades[0], colors[0]],
                [grades[1], colors[1]],
                [grades[2], colors[2]],
                [grades[3], colors[3]],
                [grades[4], colors[4]],
                [grades[5], colors[5]],
                [grades[6], colors[6]]
            ]
        },
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': 0.6
    }
}, firstSymbolId); // Add layer before the first symbol layer

// Click on circle to view case count in a popup
map.on('click', 'covidCases-point', (event) => {
    const properties = event.features[0].properties;
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`
            <strong>${properties.county}, ${properties.state}</strong><br>
            <strong>Cases:</strong> ${properties.cases ? properties.cases.toLocaleString() : 'N/A'}
        `)
        .addTo(map);
});

// Change cursor to pointer when hovering over circles
map.on('mouseenter', 'covidCases-point', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change cursor back when leaving circles
map.on('mouseleave', 'covidCases-point', () => {
    map.getCanvas().style.cursor = '';
});
});

// Create legend
const legend = document.getElementById('legend');

// Set up legend grades and labels
var labels = ['<strong>Total Cases</strong>'],
vbreak;

// Iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
vbreak = grades[i];
// Manually adjust the radius of each dot on the legend 
// to match the dots on the map
dot_radii = 2 * radii[i];
labels.push(
    '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
    'px; height: ' +
    dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + 
    vbreak.toLocaleString() +
    '</span></p>');
}

// Add the data source
const source =
'<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv" target="_blank">NY Times</a></p>';

// Combine all the html codes
legend.innerHTML = labels.join('') + source;