var tracts = ee.FeatureCollection('projects/nasa-eej/assets/tract_for_webtool')

// compute area and add it as a property
var getArea = function(feature) {
  return feature.set({area: feature.geometry().area().divide(100 * 100)});
};
var tracts_with_area = tracts.map(getArea);

Export.table.toFeatureView({
  collection: tracts_with_area,
  assetId: 'tract_featureview',
  description: 'tract_featureview',
  maxFeaturesPerTile: 1500,
  thinningStrategy: 'HIGHER_DENSITY',
  thinningRanking: ["area DESC"],
  zOrderRanking: ["area ASC"]
});