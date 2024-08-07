var legend_style = require("users/dawnschumacher/nasa-eej:src/style/legend/legend-style.js")

var green_space_classification = ee.Image('projects/nasa-eej/assets/EEJGreenSpaceClassificationR2')

var background_data = {
  "Green Space Classification" : {
    visParams: {
          min: 1,
          max: 1,
          labels: ['Green Space'],
          palette: ['#a4e38f'],
          opacity: 1
      },
    layer: green_space_classification.subtract(ee.Image.constant(1)).not().selfMask(),
    type: "categorical",
    info: "Areas classified as green space, water, or urban areas in 2020 using machine learning classification",
    unit: ""
  },
  "Trend in Degree of Greenness" : {
    visParams: {
      min: -0.01,
      max: 0.01,
      palette: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],
      opacity: 1
    },
    layer: ee.Image('projects/nasa-eej/assets/NDVI1yrTimeSeries1990to2020LinearTrendStats').select('b3'),
    type: "univariate",
    info: "Statistic describing an increasing or decreasing trend in greenness defined using the normalized difference vegetation index (NDVI; source: Landsat) between 1990 and 2020. NDVI is a unitless measure of vegetation health between -1 and 1.",
    unit: "NDVI"
  },
  "Trend in Land Surface Temperature" : {
    visParams: {
      min: -0.1,
      max: 0.5,
      palette: ["#abd9e9","#ffffbf","#fee090","#fdae61","#f46d43","#d73027","#a50026"],
      opacity: 1
    },
    type: "univariate",
    layer: ee.Image('projects/nasa-eej/assets/LST1yrTimeSeries1990to2020LinearTrendStats').select('b3'),
    info: "Statistic describing an increasing or decreasing trend in land surface temperature (LST; source: Landsat) between 1990 and 2020. LST is measured in °C.",
    unit: "°C"
  }
}

function get_categories(visParams) {
  var container = ui.Panel();
  
  for(var i = 0; i < visParams.labels.length; i++) {
    
    var label = visParams.labels[i];
    var color = visParams.palette[i];
    
    var base = ui.Panel({
      style: legend_style.category_container,
      layout: ui.Panel.Layout.flow('horizontal')
    })
    base.add(
      ui.Panel({
        style : {
          backgroundColor: color,
          height: "16px",
          width: "16px"
        }
      })
    )
    base.add(
      ui.Label({
        value : label,
        style: legend_style.category_label
      })
    )
    
    container.add(base);
  }
  
  return container;
}

function get_color_bar(palette) {
  return ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    
      // Parameters for color bar.
      params: {
        // Bounding box for color bar.
        bbox: [0, 0, 1, 0.1],
        // Dimensions of color bar.
        dimensions: '100x10',
        // Format of color bar.
        format: 'png',
        // Min value for color bar.
        min: 0,
        // Max value for color bar.
        max: 1,
        // Color palette for color bar.
        palette: palette
      },
      
      style: {
          // Stretch color bar horizontally.
          stretch: 'horizontal',
          // Margin of color bar.
          margin: '0px 0px 0px 0px',
          // Max height of color bar.
          maxHeight: '20px',
          // Width of color bar.
          width: '100%'
      },
  });
}

exports.data = background_data

exports.get_categories = get_categories
exports.get_color_bar = get_color_bar 