var cities = ee.FeatureCollection('projects/nasa-eej/assets/BayAreaCities')

// compute area and add it as a property
var getArea = function(feature) {
  return feature.set({area: feature.geometry().area().divide(100 * 100)});
};
var cities_with_area =  cities.map(getArea);

Export.table.toFeatureView({
  collection:  cities_with_area,
  assetId: 'cities_featureview',
  description: 'cities_featureview',
  maxFeaturesPerTile: 101,
  thinningStrategy: 'HIGHER_DENSITY',
  thinningRanking: ["area DESC"],
  zOrderRanking: ["area ASC"]
});