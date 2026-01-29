# US COVID-19 Mapping Project

## Introduction
This project visualizes COVID-19 data across the United States at the county level for 2020 through two interactive web maps. Map 1 is a choropleth map showing case rates per thousand residents, while Map 2 is a proportional symbol map displaying total case counts. Both maps allow users to explore the geographic distribution and impact of COVID-19 across different counties.

## Map Links
- **Choropleth Map (COVID-19 Rates):** [https://jdeng137.github.io/us_covid_data_viz/map1.html](https://jdeng137.github.io/us_covid_data_viz/map1.html)
- **Proportional Symbol Map (COVID-19 Cases):** [https://jdeng137.github.io/us_covid_data_viz/map2.html](https://jdeng137.github.io/us_covid_data_viz/map2.html)html)

## Screenshots

### Map 1: COVID-19 Case Rates (Choropleth Map)
![COVID-19 Rates Map](img/map1.png)
*This choropleth map displays COVID-19 case rates per 1,000 residents across US counties, with darker red colors indicating higher infection rates.*

### Map 2: COVID-19 Total Cases (Proportional Symbol Map)
![COVID-19 Cases Map](img/map2.png)
*This proportional symbol map uses graduated circles to represent total COVID-19 cases by county, with larger circles indicating more cases.*

## Primary Functions

**Map 1 (Choropleth Map):**
- Color-coded counties based on case rates (cases per 1,000 people)
- 10-class color scheme from light yellow (0-19) to dark red (300+)
- Interactive popups showing county name, state, case rate, and total cases
- Click on any county to view detailed information

**Map 2 (Proportional Symbol Map):**
- Graduated circles sized by total COVID-19 cases
- 7 size classes ranging from 1,000 to 300,000+ cases
- Color gradient with darker blues for higher case counts
- Click on circles to view county details
- Hover effect with pointer cursor

**Advanced Function (Not Covered in Lectures):**

Both maps implement **layer ordering** to ensure city and place labels appear on top of the data layers. This was achieved by finding the first symbol layer in the basemap and inserting the COVID data layer before it:
```javascript
const layers = map.getStyle().layers;
let firstSymbolId;
for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
        firstSymbolId = layers[i].id;
        break;
    }
}
map.addLayer({...}, firstSymbolId);
```

This ensures that place names remain visible and readable on top of the colored counties and proportional symbols.

## Libraries in Use
- **Mapbox GL JS (v2.8.1)** - For interactive map rendering and visualization
- **Google Fonts** - For typography usage

## Data Sources
- **COVID-19 Data:** [The New York Times](https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv) - County-level COVID-19 cases for 2020
- **Population Data:** [US Census Bureau, 2018 ACS 5-Year Estimates](https://data.census.gov/cedsci/table?g=0100000US.050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true) - Used to calculate case rates
- **County Boundaries:** US Census Bureau

## Acknowledgments
- Map design and lab materials provided by Professor Bo Zhao, University of Washington
- Data processing assistance by Steven Bao
- Created for GEOG 458: Advanced Digital Geographies

## AI Disclosure
I used AI (Claude) in this assignment for debugging, code optimization, and implementing the layer ordering feature to ensure labels appear on top of data layers. AI assistance was also used for adjusting legend breakpoints and troubleshooting Git repository issues. I did not use AI to write or complete any core mapping components, and I am able to explain all code implementations and design decisions in the project.