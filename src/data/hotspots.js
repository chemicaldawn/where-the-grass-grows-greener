var cities = ui.Map.FeatureViewLayer("projects/nasa-eej/assets/cities_featureview", null, "Cities", false);

function highlight_city(name) {
  return {
    polygonFillOpacity: 0,
    polygonStrokeWidth: 2,
    
    polygonStrokeOpacity: {
      property: "CITY",
      defaultValue: 0,
      categories: [[name, 1]]
    }
  }
}

exports.data = {
  "Suisun City" : {
    lon: 38.24,
    lat: -122.04,
    zoom: 14,
    url: "https://www.greenbelt.org/hotspots/suisun-city/"
  },
  
  "Southwest Santa Rosa" : {
    lon: 38.41,
    lat:  -122.76,
    zoom: 13,
    url: "https://www.greenbelt.org/hotspots/southwest-santa-rosa/"
  },
  
  "North Richmond" : {
    lon: 37.95,
    lat: -122.37,
    zoom: 14,
    url: "https://www.greenbelt.org/hotspots/north-richmond/"
  },
  
  "Newark" : {
    lon: 37.52,
    lat: -122.03,
    zoom: 13,
    url: "https://www.greenbelt.org/hotspots/newark/"
  },
  
  "Gilroy" : {
    lon: 37.00,
    lat: -121.58,
    zoom: 13,
    url: "https://www.greenbelt.org/hotspots/gilroy/"
  }
}

exports.cities = cities;
exports.highlight_city = highlight_city;
