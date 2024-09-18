var tracts = ee.FeatureCollection("projects/nasa-eej/assets/tract_for_webtool");
var tract_layer = ui.Map.FeatureViewLayer("projects/nasa-eej/assets/tract_featureview", null, "Tracts", false);
var highlight_layer = ui.Map.FeatureViewLayer("projects/nasa-eej/assets/tract_featureview", null, "Highlighting", false);

var bin_style = require("users/dawnschumacher/nasa-eej:src/style/sidebar/bin-style.js")
var legend_style = require("users/dawnschumacher/nasa-eej:src/style/legend/legend-style.js")

var palettes = require("users/dawnschumacher/nasa-eej:src/data/palettes/palettes.js")

var var1 = ["None", "Degree of Greenness", "Land Surface Temperature"]
var var2 = ["None", "Displacement Risk", "Social Vulnerability", "Average Housing Price Increase"]

var tract_data = {
  "Degree of Greenness and Displacement Risk" : {
    id : "ne",
    palette: palettes.purgrn,
    info : "Degree of greenness compared to level of displacement risk in 2019 (from Estimated Displacement Risk model) at the census tract level. Degree of greenness is defined using the median normalized difference vegetation index (NDVI; source: Landsat). NDVI is a unitless measure of vegetation health between -1 and 1.",
    
    bin_labels : ["Degree of Greenness", "Displacement Risk"],
    bins_x : ["-0.1", "0.26", "0.34", "0.82"], 
    bins_y : ["See methodology...", "", "", ""]
    
  },
  "Degree of Greenness and Social Vulnerability" : {
    id : "ns",
    palette: palettes.pnkgrn,
    info : "Degree of greenness in 2019 compared to CDC's 2018 Social Vulnerability Index at the census tract level. Degree of greenness is defined using the median normalized difference vegetation index (NDVI; source: Landsat). NDVI is a unitless measure of vegetation health between -1 and 1.",
    
    bin_labels : ["Degree of Greenness", "Social Vulnerability Index"],
    bins_x : ["-0.1", "0.26", "0.34", "0.82"], 
    bins_y : ["0", "0.21", "0.48", "1"]
  },
  "Degree of Greenness and Average Housing Price Increase" : {
    id : "nshp",
    palette: palettes.blugrn,
    info : "Rate of change in greenness (1990 - 2019) & percent change in yearly average housing price (2000 - 2020) at the zip code level. Degree of greenness is defined using the median normalized difference vegetation index (NDVI; source: Landsat). NDVI is a unitless measure of vegetation health between -1 and 1. Only zip codes with statistically significant (p < 0.05) greenness trends are shown.",
    
    bin_labels : ["Trend in Degree of Greenness", "Housing Price Increase"],
    bins_x : ["0.0004", "0.0018", "0.0027", "0.0076"],
    bins_y : ["89%", "143%", "177%", "506%"]
  },
  "Land Surface Temperature and Displacement Risk" : {
    id : "le",
    palette: palettes.purorn,
    info : "Median land surface temperature (LST; source: Landsat) compared to displacement risk in 2019 (from Estimated Displacement Risk model) at the census tract level.",
    
    bin_labels : ["Land Surface Temperature", "Displacement Risk"],
    bins_x : ["17.78 °C", "34.5 °C", "37.17 °C", "43.47 °C"],
    bins_y : ["See methodology...", "", "", ""]
  },
  "Land Surface Temperature and Social Vulnerability" : {
    id : "ls",
    palette: palettes.pnkorn,
    info : "Median land surface temperature (LST; source: Landsat) in 2019 compared to CDC's 2018 Social Vulnerability Index at the census tract level.",
    
    bin_labels : ["Land Surface Temperature", "Social Vulnerability Index"],
    bins_x : ["17.78 °C", "34.5 °C", "37.17 °C", "43.47 °C"],
    bins_y : ["0", "0.21", "0.48", "1"]
  },
  "Land Surface Temperature and Average Housing Price Increase" : {
    id : "lshp",
    palette: palettes.bluorn,
    info : "Rate of change in land surface temperature (LST; source: Landsat) from 1990 to 2019 compared to percent change in yearly average housing price from 2000 to 2020 at the zip code level. Only zip codes with statistically significant (p < 0.05) land surface temperature trends are shown.",
    
    bin_labels : ["Rate of Change of Land Surface Temperature", "Housing Price Increase"],
    bins_x : ["0.11", "0.26", "0.32", "0.47"],
    bins_y: ["89%", "143%", "177%", "506%"]
  }
}

function to_dict(palette) {
  var dict = {};
  
  for(var i = 0; i < palette.length; i++) {
    dict[palette[i][0]] = palette[i][1]
  }
  
  return dict;
}

// Returns a layer with all of the census tracts colored correctly to represent the data.
function get_vis_params(value, accessible) {
  
  var id = tract_data[value].id;
  var palette;

  if (!accessible) {
    palette = tract_data[value].palette
  } else {
    palette = palettes.highcontrast
  }
  
  return {
    polygonFillColor: {
      property: id,
      defaultValue: '#FFFFFF',
      categories: palette
    },
    
    pointSize: 0,
    polygonStrokeWidth: 0.5,
    
    opacity: {
      property: id,
      defaultValue: 0.7,
      categories: palettes.opacity
    }
  }
}

function get_highlight(highlighted_tract) {
  return {
    polygonFillOpacity: 0,
    
    polygonStrokeWidth: {
      property: "GEOID",
      defaultValue: 0,
      categories: [[highlighted_tract, 2]]
    }
  }
}

tract_layer.setVisParams(get_vis_params("Degree of Greenness and Displacement Risk", false));
highlight_layer.setVisParams(get_highlight(""));

function get_square(color) {
  return ui.Panel({
    style : {
      height: "16px",
      width: "16px",
      
      backgroundColor: color
    }
  })
}

function get_matrix(var1, var2, categories) {

  var category_dict = to_dict(categories);

  // This is the worst, least readable code I've ever written.
  return ui.Panel({
    widgets: [
  
      // Upper Container
      ui.Panel({
        
        widgets: [
          // Columns
          ui.Panel({
            widgets : [
              
              // Rows
              ui.Panel({
                widgets : [
                  get_square(category_dict["1_3"]),
                  get_square(category_dict["2_3"]),
                  get_square(category_dict["3_3"])
                ],
                layout: ui.Panel.Layout.flow("horizontal")
              }),
              ui.Panel({
                widgets : [
                  get_square(category_dict["1_2"]),
                  get_square(category_dict["2_2"]),
                  get_square(category_dict["3_2"])
                ],
                layout: ui.Panel.Layout.flow("horizontal")
              }),
              ui.Panel({
                widgets : [
                  get_square(category_dict["1_1"]),
                  get_square(category_dict["2_1"]),
                  get_square(category_dict["3_1"])
                ],
                layout: ui.Panel.Layout.flow("horizontal")
              })
            ],
            layout: ui.Panel.Layout.flow("vertical")
          }),
          
          // Right-side Label
          ui.Label({
            value: "↑ " + var2,
            style: legend_style.bivariate_label_right
          })
        ],
        
        style: legend_style.category_container,
        layout: ui.Panel.Layout.flow("horizontal")
      }),
      
      // Lower Label
      ui.Label({
        value: "→ " + var1,
        style: legend_style.bivariate_label_bottom
      })
    ],
    
    style: legend_style.category_container,
    layout: ui.Panel.Layout.flow("vertical")
  });
}

function get_bin_grid(var1, var2, categories) {
  
  var category_dict = to_dict(categories);
  var var_name = var1 + " and " + var2;
  
  var bins_x = tract_data[var_name].bins_x;
  var bins_y = tract_data[var_name].bins_y;
  
  var section = ui.Panel({
    style: {
      padding: "12px 0px 0px 0px"
    }
  })
  var horizontal_group = ui.Panel()
  horizontal_group.setLayout(ui.Panel.Layout.flow("horizontal", true));

  
  section.add(ui.Label({
    value: "Bin Thresholds",
    style: bin_style.threshold_title
  }));
  
  var bin_grid = ui.Panel();
  bin_grid.setLayout(ui.Panel.Layout.flow("vertical", true));
  
  for(var i = 0; i < 7; i++) {
    
    if (i % 2 == 0) {
      bin_grid.add(get_bin_spacing_row());
    }
    
    else {
      bin_grid.add(get_bin_row(4 - ((i - 1) / 2 + 1), category_dict));
    }
  }  

  var up_label = ui.Label({
    value : "↑ " + var2,
    style: bin_style.up_label
  });
  var right_label = ui.Label({
    value: "→ " + var1,
    style: bin_style.right_label
  })

  section.add(get_horizontal_bins(bins_x));
  horizontal_group.add(bin_grid);
  horizontal_group.add(get_vertical_bins(bins_y));
  horizontal_group.add(up_label);
  section.add(horizontal_group);
  section.add(right_label);

  return section;
}

function get_vertical_bins(bins) {
  var vertical_group = ui.Panel()
  vertical_group.setLayout(ui.Panel.Layout.flow("vertical", true));
  
  for(var i = 0; i < 4; i++) {
    var horizontal_group = ui.Panel()
    horizontal_group.setLayout(ui.Panel.Layout.flow("horizontal", true));

    horizontal_group.add(ui.Panel({
      style: bin_style.horizontal_pip
    }))

    var label_panel = ui.Panel({
      style : bin_style.horizontal_label_panel
    });
    label_panel.add(ui.Label({
      value: bins[3 - i],
      style : bin_style.horizontal_label
    }));
    label_panel.setLayout(ui.Panel.Layout.flow("vertical", false));

    horizontal_group.add(label_panel);    
    vertical_group.add(horizontal_group);
  }
  
  return vertical_group;
}

function get_horizontal_bins(bins) {
  var horizontal_group = ui.Panel();
  horizontal_group.setLayout(ui.Panel.Layout.flow("horizontal", true));

  for(var i = 0; i < 4; i++) {
    var vertical_group = ui.Panel()
    vertical_group.setLayout(ui.Panel.Layout.flow("vertical", true));

    var label_panel = ui.Panel({
      style : bin_style.horizontal_label_panel
    });    
    label_panel.add(ui.Label({
      value: bins[i],
      style : bin_style.vertical_label
    }));
    vertical_group.add(label_panel)

    vertical_group.add(ui.Panel({
      style: bin_style.vertical_pip
    }))
    
    horizontal_group.add(vertical_group);
  }

  return horizontal_group;
}

function get_bin_spacing_row() {
  
  var bin_row = ui.Panel();
  bin_row.setLayout(ui.Panel.Layout.flow("horizontal"));
  
  bin_row.add(ui.Panel({
    style: bin_style.horizontal_cross
  }));
  
  return bin_row;
}

function get_bin_row(row_number, categories) {
  
  var bin_row = ui.Panel();
  bin_row.setLayout(ui.Panel.Layout.flow("horizontal"));
  
  for(var i = 0; i < 7; i++) {
    
    // Vertical Cross-bars
    if (i % 2 === 0) {
      bin_row.add(ui.Panel({
        style: bin_style.vertical_cross
      }));
    }
    // Squares
    else {
      
      var index = ((i - 1) / 2 + 1).toString() + "_" + row_number.toString();

      bin_row.add(
        bin_style.get_square(categories[index])
      );
    }
  }
  
  return bin_row;
}

exports.tracts = tracts
exports.tract_layer = tract_layer
exports.highlight_layer = highlight_layer
exports.data = tract_data

exports.get_vis_params = get_vis_params
exports.get_highlight = get_highlight
exports.get_matrix = get_matrix

exports.get_bin_grid = get_bin_grid

exports.var1 = var1
exports.var2 = var2