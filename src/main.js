//earthengine

/*
  Main
  
  Contains all logic for reactive UI elements. Unfortunately, due to how Earth Engine Apps works
  internally, we have to do this all in one file. Subsections are defined by additional block comments
  to try and organize this massive file.
*/

// Style Imports
var uix = require("users/dawnschumacher/nasa-eej:src/uix.js")

var map_style = require("users/dawnschumacher/nasa-eej:src/style/map/map-style.js").style;
var map = ui.Map();

var sidebar_style = require("users/dawnschumacher/nasa-eej:src/style/sidebar/sidebar-style.js");
var sidebar = ui.Panel({
  style: sidebar_style.legend
});

var legend_style = require("users/dawnschumacher/nasa-eej:src/style/legend/legend-style.js");

// Data Imports
var raster = require("users/dawnschumacher/nasa-eej:src/data/map/raster.js");
var raster_data = require("users/dawnschumacher/nasa-eej:src/data/map/raster.js").data;

var vector = require("users/dawnschumacher/nasa-eej:src/data/map/vector.js");
var vector_data = require("users/dawnschumacher/nasa-eej:src/data/map/vector.js").data;

var hotspots = require("users/dawnschumacher/nasa-eej:src/data/map/hotspots.js");
var hotspot_data = require("users/dawnschumacher/nasa-eej:src/data/map/hotspots.js").data;

var palettes = require("users/dawnschumacher/nasa-eej:src/data/palettes/palettes.js");
var resources = require("users/dawnschumacher/nasa-eej:src/data/resources/resources.js").data;

/*
  Data Processing
*/

var raster_layer_list = ["None"];
var vector_layer_list_1 = require("users/dawnschumacher/nasa-eej:src/data/map/vector.js").var1;
var vector_layer_list_2 = require("users/dawnschumacher/nasa-eej:src/data/map/vector.js").var2;

// Iterates over all listed layers, adds them to the map object, and compiles them into a list for use in the UI dropdown element.
for(var layer in raster_data) {
  map.addLayer({
    name: layer,
    eeObject: raster_data[layer]["layer"],
    visParams: raster_data[layer]["visParams"],
    shown : false
  });
  
  raster_layer_list.push(layer);
}

// Adds the two vector layers. Instead of using one layer for each bivariate correlation, I've opted
// to dynamically update the styling of one census tract layer with each correlation.
var tracts = vector.tracts
var tract_layer = vector.tract_layer
var highlight_layer = vector.highlight_layer
map.add(tract_layer);
map.add(highlight_layer);

var tract_data = ee.FeatureCollection("")

// 
var cities = hotspots.cities
cities.setVisParams(hotspots.highlight_city("None"))
cities.setShown(false);
map.add(cities);

/*
  UI
*/
/*
  Legend
*/
var legend = ui.Panel({
  style: legend_style.panel
}); 
legend.add(ui.Label({
  value: "Legend",
  style: legend_style.h1
}))

var legend_content = ui.Panel();

var legend_raster = ui.Panel({
  style: legend_style.subpanel
});
var legend_vector = ui.Panel({
  style: legend_style.subpanel
});

legend.add(legend_content);

/*
  Content Panel
*/
// Create the base content panel inside the legend.
var content = ui.Panel({
  style: sidebar_style.panel
});

// Create the base navbar panel.
var navbar = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: sidebar_style.navbar
});
  
// Create the containing panel for the row of buttons at the top, ensuring they are
// displayed in a horizontal row.
var button_row = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
})
  
// Create the blue highlight bar that changes position.
var nav_highlight = ui.Panel({
  style: sidebar_style.nav_highlight
})
  
// Create the buttons. I would do this with a loop but it literally didn't work whatsoever.
var about_button = ui.Button({
  label: "About",
  style: sidebar_style.navbar_button
});

var layer_select_button = ui.Button({
  label: "View the Data",
  style: sidebar_style.navbar_button
});

var explore_button = ui.Button({
  label: "Resilience Hotspots",
  style: sidebar_style.navbar_button
});

var resources_button = ui.Button({
  label: "Resource Guide",
  style: sidebar_style.navbar_button
});

// Add the navbar buttons to the navigation panel.
button_row.add(about_button);
button_row.add(layer_select_button);
button_row.add(explore_button);
button_row.add(resources_button);

about_button.onClick(function() {
  change_section(0)
});
layer_select_button.onClick(function() {
  change_section(1)
});
explore_button.onClick(function() {
  change_section(2)
});
resources_button.onClick(function() {
  change_section(3)
});

// Construct the final navbar object.
navbar.add(button_row);
navbar.add(nav_highlight);

// Changes the visible section by stretching or shrinking the margin of the blue highlight UI panel.
function change_highlight(section_index) {

  nav_highlight.style().set({
    margin: "0% 0% 0% " + (25 * section_index).toString() + "%"
  });
}

// Changes what is displayed in the "content" ui panel, creating a multi-page scrolling effect.
function change_section(section_index) {

  change_highlight(section_index);
  content.clear();
  
  // Add the corresponding UI elements depending on which tab is pressed.
  switch(section_index) {
    case 0:
      content.add(about);
      break;
    case 1:
      content.add(layers);
      break;
    case 2:
      content.add(explore);
      break;
    case 3:
      content.add(resources_panel);
      break;
  }
}

/*
  About
  
  The landing page for the tool.
*/

var about = ui.Panel();

about.add(ui.Label({
  value: "Where the Grass Grows Greener",
  style: sidebar_style.h1
}));

about.add(ui.Label({
  value: "The Impacts of Urban Greening on Housing Prices and Neighborhood Stability",
  style: sidebar_style.h2
}));

about.add(ui.Label({
  value: "This webtool shows trends in urban greenery and land surface temperature in the San Francisco Bay Area between 1990 and 2020. It also illustrates spatial relationships with socioeconomic indicators such as housing prices and displacement risk. Note that the vector layers include only census tracts or zip codes that are located in areas designated as 'urban'.",
  style: sidebar_style.p
}));

about.add(ui.Panel({
  style: sidebar_style.hr
}));

about.add(ui.Label({
  value: "Using This Tool",
  style: sidebar_style.b
}));
about.add(ui.Label({
  value: "Above this sidebar, there is a navigation bar with four buttons, each associated with a unique page. Clicking on them will bring you to the associated page.",
  style: sidebar_style.p
}));
about.add(ui.Label({
  value: "The View the Data section houses most of this tool's primary functionality. An interface is provided to view a variety of raster and vector data layers pertaining to urban greenness, heat, and socioeconomic data. To view a raster layer, click on the dropdown and click the desired layer. To display a vector layer, you must choose two variables, and the layer will automatically render. Raster and vector layers may be rendered on top of one another, and the opacity may be adjusted using a slider at the bottom of each panel.",
  style: sidebar_style.p
}));
about.add(uix.Bullet({
  value: "test",
  style: sidebar_style.p
}))
about.add(ui.Label({
  value: "The Resilience Hotspots section allows you to focus in on specific communities, named by the Greenbelt Alliance as Resilience Hotspots, where interesting trends in the data may be visible. Before you navigate to this page, you must enable layers under 'View the Data', otherwise nothing but an outline will be visible. Layers selected in 'View the Data' will always persist between tabs.",
  style: sidebar_style.p
}));
about.add(ui.Label({
  value: "Finally, the Resource Guide section provides links to other resources that may be helpful in analyzing the Bay Area's climate and socioeconomic geograpy.",
  style: sidebar_style.p
}));

about.add(ui.Panel({
  style: sidebar_style.hr
}));

about.add(ui.Label({
  value: "Created by Dawn Schumacher, Eric Romero, and Julia Greenberg",
  style: sidebar_style.footer
}));

about.add(ui.Label({
  value: "Funding from the NASA Equity and Environmental Justice program, Data Integration Project, grant no. 80NSSC22K1699",
  style: sidebar_style.footer
}));

/*
  Layer Select
  
  The page for granular control over the map layers and map opacity.
*/
var layers = ui.Panel();

layers.add(ui.Label({
  value: "View the Data",
  style: sidebar_style.h1
}));
layers.add(ui.Label({
  value: "Layer Select",
  style: sidebar_style.h2
}));
layers.add(ui.Panel({
  style: sidebar_style.br
}))

var raster_layer = null;
var vector_layer = null;

function redraw_map () {

  // Select which layers to show
  map.layers().forEach(function(element, index) {
      if(element.getName() == raster_layer) {
        element.setShown(true);
      }
      
      else if(element.getName() == "Tracts") {
        element.setShown(vector_layer !== null);
      }
      
      else if(element.getName() == "Highlighting") {
        element.setShown(vector_layer !== null);
      }
      
      else if(element.getName() == "Cities") {
        element.setShown(true);
      }
      
      else {
        element.setShown(false);
      }
  });
  
  // Add the raster/vector content to the legend depending on layer visibility
  legend_content.clear();
  if(raster_layer) {
    legend_content.add(legend_raster);
  }
  if(vector_layer) {
    legend_content.add(legend_vector);
  }
  
  // If any layer is showing, show the legend
  map.remove(legend);
  if(raster_layer !== null || vector_layer !== null) {
    map.add(legend);
  }
  
  // Set the opacity of layers according to the opacity sliders
  set_opacity();
}

function set_opacity () {
  map.layers().forEach(function(element, index) {
      if(element.getName() == raster_layer) {
        element.setOpacity(raster_slider.getValue())
      }
      else if(element.getName() == "Tracts") {
        element.setOpacity(vector_slider.getValue())
      }
      else if(element.getName() == "Highlighting") {
        element.setOpacity(vector_slider.getValue())
      }
  });
}

/* 
  Layer Selection Functions
*/
function set_raster_layer(name) {
  if(name != "None") {
    raster_layer = name;
    
    raster_infobox.clear();
    raster_infobox.add(ui.Label({
      value: raster_data[name]["info"],
      style: sidebar_style.infolabel
    }));
    
    // Build the label for the legend entry. Appends the unit onto the end of the label for better user
    // experience.
    var legend_label = name
    if(raster_data[name]["unit"] !== "") {
      legend_label += " (" + raster_data[name]["unit"] + ")"
    }

    // Adds the label entry to the legend    
    legend_raster.clear();
    legend_raster.add(
      ui.Label({
        value: legend_label,
        style: legend_style.h2
      })  
    )
    
    // Add legend entry content
    if(raster_data[name]["type"] == "categorical") {
      legend_raster.add(
        raster.get_categories(raster_data[name]["visParams"])
      )
    }
    
    else if(raster_data[name]["type"] == "univariate") {
      // Adds the color bar to the legend
      legend_raster.add(
        raster.get_color_bar(raster_data[name]["visParams"]["palette"])
      )
      
      // Adds the bottom labels to the legend
      legend_raster.add(ui.Panel({
        widgets: [
          ui.Label(raster_data[name]["visParams"]["min"], 
            legend_style.min
          ),
          ui.Label('', 
            legend_style.spacer
          ),
          ui.Label(raster_data[name]["visParams"]["max"], 
            legend_style.max
          ),
        ],
        
        layout: ui.Panel.Layout.flow('horizontal'),
        style: legend_style.labels
        
      }));
    }
    
  }
  else {
    raster_layer = null;
    
    raster_infobox.clear();
  }
  
  redraw_map();
}

function color_vector_layer() {
  map.layers().forEach(function(element, index) {
    if(element.getName() == "Tracts") {
      element.setVisParams(vector.get_vis_params(vector_layer, accessibility_checkbox.getValue()))
    }
  })
}

function highlight_tract() {
  map.layers().forEach(function(element, index) {
    if(element.getName() == "Highlighting") {
      element.setVisParams(vector.get_highlight(selected_tract))
    }
  })
}

function set_vector_layer() {
  var var1 = vector_select_1.getValue();
  var var2 = vector_select_2.getValue();
  var palette;
  
  if(var1 != "None" && var2 != "None") {
    vector_layer = var1 + " and " + var2;
    
    // Find the tracts layer and set the colors corresponding to the given data set.
    color_vector_layer();

    if (!accessibility_checkbox.getValue()) {
      palette = vector_data[vector_layer].palette;
    } else {
      palette = palettes.highcontrast;
    }

    vector_infobox.clear();
    vector_infobox.add(ui.Label({
      value: vector_data[vector_layer]["info"],
      style: sidebar_style.infolabel
    }));
    
    vector_infobox.add(
      vector.get_bin_grid(var1, var2, palette)
    )
    
    // Build the label for the legend entry.
    var legend_label = vector_layer;
    
    // Adds the label entry to the legend    
    legend_vector.clear();
    legend_vector.add(
      ui.Label({
        value: legend_label,
        style: legend_style.h2
      })  
    )
    
    legend_vector.add(
      vector.get_matrix(var1, var2, palette)
    )
  }
  else {
    vector_layer = null;
  }
  
  redraw_map();
}

// Raster Layerbox
var raster_layerbox = ui.Panel({
  style: sidebar_style.rasterbox
});
raster_layerbox.add(ui.Label({
  value: "Background Layer",
  style: sidebar_style.rasterlabel
}));

var raster_select = ui.Select({
  items: raster_layer_list,
  placeholder: "Select a layer...",
  value: "None",
  style: sidebar_style.rasterbutton
});
raster_select.onChange(function (layer) {
  set_raster_layer(layer);
});

var raster_slider_container = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {
    backgroundColor: sidebar_style.rasterlabel.backgroundColor
  }
});
raster_slider_container.add(ui.Label({
  value: "Opacity",
  style: sidebar_style.rasteropacity
}));

var raster_slider = ui.Slider({
  min: 0,
  max: 1,
  value: 1,
  step: 0.01,
  style: sidebar_style.rasterslider
});
raster_slider.onSlide(set_opacity);
raster_slider_container.add(raster_slider);

var raster_infobox = ui.Panel({
  style: sidebar_style.infobox
});
raster_infobox.add(ui.Label({
  value: "Select a background layer to display additonal info...",
  style: sidebar_style.infolabel
}))

// Vector Layerbox
var vector_layerbox = ui.Panel({
  style: sidebar_style.vectorbox
});
vector_layerbox.add(ui.Label({
  value: "Two-variable Correlation",
  style: sidebar_style.vectorlabel
}));

var vector_select_1 = ui.Select({
  items: vector_layer_list_1,
  placeholder: "Select a layer...",
  value: "None",
  style: sidebar_style.vectorbutton
});
vector_select_1.onChange(set_vector_layer);
var vector_select_2 = ui.Select({
  items: vector_layer_list_2,
  placeholder: "Select a layer...",
  value: "None",
  style: sidebar_style.vectorbutton
});
vector_select_2.onChange(set_vector_layer);

var vector_slider_container = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {
    backgroundColor: sidebar_style.vectorlabel.backgroundColor
  }
});

vector_slider_container.add(ui.Label({
  value: "Opacity",
  style: sidebar_style.vectoropacity
}));

var vector_slider = ui.Slider({
  min: 0,
  max: 1,
  value: 1,
  step: 0.01,
  style: sidebar_style.vectorslider
});
vector_slider.onSlide(set_opacity);
vector_slider_container.add(vector_slider);

var accessibility_checkbox = ui.Checkbox({
  label : "Use Higher-Contrast Palette",
  value: false,
  style: {
    backgroundColor: sidebar_style.vectorlabel.backgroundColor
  }
})
accessibility_checkbox.onChange(function () {
  set_vector_layer();
});


var vector_infobox = ui.Panel({
  style: sidebar_style.infobox
});
vector_infobox.add(ui.Label({
  value: "Select two variables to display additional info...",
  style: sidebar_style.infolabel
}));

raster_layerbox.add(raster_infobox);
raster_layerbox.add(raster_select);
raster_layerbox.add(raster_slider_container);

vector_layerbox.add(vector_infobox);
vector_layerbox.add(vector_select_1);
vector_layerbox.add(vector_select_2);
vector_layerbox.add(vector_slider_container);
vector_layerbox.add(accessibility_checkbox);

layers.add(raster_layerbox);
layers.add(vector_layerbox);

sidebar.add(navbar);
sidebar.add(content);
layers.add(ui.Panel({
  style: sidebar_style.hr
}))

layers.add(ui.Label({
  value: "Additional Documentation",
  style: sidebar_style.h2
}))
layers.add(ui.Label({
  value: "Notes on geospatial methods...",
  style: sidebar_style.p
}).setUrl("https://github.com/chemicaldawn/where-the-grass-grows-greener/blob/master/docs/geospatial_methods.pdf"))
layers.add(ui.Label({
  value: "This document outlines how the data presented in this tool was processed, detailing specifics about machine learning classification, validation, and how spatiotemporal trends were derived.",
  style: sidebar_style.a
}))
layers.add(ui.Label({
  value: "Webtool variable documentation...",
  style: sidebar_style.p
}).setUrl("https://github.com/chemicaldawn/where-the-grass-grows-greener/blob/master/docs/web_app_variables.pdf"))
layers.add(ui.Label({
  value: "The webtool variable documentation outlines how each variable, especially Social Vulnerability and Displacement Risk, were sourced, and how data bins were determined.",
  style: sidebar_style.a
}))

/*
  Explore
*/

var explore = ui.Panel();

explore.add(ui.Label({
  value: "Explore",
  style: sidebar_style.h1
}));
explore.add(ui.Label({
  value: "Bay Area Resilience Hotspots",
  style: sidebar_style.h2
}));

explore.add(ui.Panel({
  style: sidebar_style.hotspotbox
})
.add(ui.Label({
  value: '"The Bay Area Resilience Hotspots initiative is a blueprint for where we must protect communities that stand to lose the most in the face of climate change in ways that co-benefit habitats, open spaces, biodiversity, recreation, and more."',
  style: sidebar_style.hotspotlabel
}))
.add(ui.Label({
  value: "- From Greenbelt Alliance's webpage, accessed 22 May 2024.",
  style: sidebar_style.hotspotlabel
})
.setUrl("https://www.greenbelt.org/hotspots/#about")));

explore.add(ui.Label({
  value: "To view the data from a Resilience Hotspot, first, select the hotspot from the drop-down menu below. Then, navigate back to View the Data to change which layers are available and observe trends.",
  style: sidebar_style.p
}));

var hotspot_inline = ui.Panel({
  style: sidebar_style.hotspot_inline
})
hotspot_inline.setLayout(ui.Panel.Layout.flow("horizontal", false));

var hotspot_select = ui.Select({
  placeholder: "Select a Resilience Hotspot...",
  style: sidebar_style.hotspot_select
});
var hotspot_button = ui.Button({
  label: "Zoom",
  style: sidebar_style.hotspot_button
});
hotspot_button.setDisabled(true);

var hotspot_info = ui.Panel();

for(var hotspot in hotspot_data) {
  hotspot_select.items().add(hotspot);
}

hotspot_select.onChange(function (hotspot) {
  hotspot_button.setDisabled(false);
  map.setCenter(hotspot_data[hotspot].lat, hotspot_data[hotspot].lon, hotspot_data[hotspot].zoom)
  
  cities.setShown(true);
  cities.setVisParams(hotspots.highlight_city(hotspot));
  
  hotspot_info.clear();
  hotspot_info.add(ui.Label({
    value: "More information on " + hotspot + " from Greenbelt Alliance...",
    style: sidebar_style.p
  }).setUrl(hotspot_data[hotspot].url));
});
hotspot_button.onClick(function() {
  var hotspot = hotspot_select.getValue();
  map.setCenter(hotspot_data[hotspot].lat, hotspot_data[hotspot].lon, hotspot_data[hotspot].zoom)
});

hotspot_inline.add(hotspot_select);
hotspot_inline.add(hotspot_button);
explore.add(hotspot_inline);
explore.add(hotspot_info);

/*
  Resources
*/
var resources_panel = ui.Panel();

resources_panel.add(ui.Label({
  value: "Resource Guide",
  style: sidebar_style.h1
}));

resources.forEach(function(resource, index) {
  resources_panel.add(ui.Label({
    value: resource["title"],
    style: sidebar_style.h3
  }));
  resources_panel.add(ui.Label({
    value : resource["link"],
    targetUrl: resource["link"],
    style: sidebar_style.pa
  }));
  resources_panel.add(ui.Label({
    value : resource["description"],
    style: sidebar_style.pa
  }));
});

/*
  Click Handling
*/
var selected_tract = ""

map.onClick(function(location) {
  var filtered = tracts.filterBounds(ee.Geometry.Point([location.lon, location.lat]));
  
  var new_tract = filtered.first();
  print(new_tract);
  
  if(new_tract === null) {
    selected_tract = "";
    map.remove(tract_data);
    
  }
  else {
    
    var new_id = new_tract.get("GEOID");
    
    if(selected_tract == new_id) {
      selected_tract = "";
      map.remove(tract_data);
      
    }
    else {
      
      selected_tract = new_id;
      map.remove(tract_data);
      map.add(tract_data);
    }
  }
  
  highlight_tract();
});

/*
  Tract-level Data
*/
var tract_data = ui.Panel({
  style: legend_style.tract_panel
}); 
tract_data.add(ui.Label({
  value: "Tract Data",
  style: legend_style.h1
}))

var table_panel = ui.Panel();
tract_data.add(table_panel);

function update_tract_data() {
  
}

/*
  Map
  
  Contains all of the settings initially applied to the map.
*/
// Sets the map's visual style, creating a grayscale map.
map.setOptions('Map', {
  Map: map_style
},
["Map","SATELLITE"]);

// Modifies the map controls, disabling unnessecary ones to improve readability.
map.setControlVisibility({
    all: false,
    layerList: false,
    zoomControl: false,
    scaleControl: true,
    mapTypeControl: true,
    fullscreenControl: false
});

// Sets the cursor style to a crosshair.
map.style().set('cursor', 'crosshair');

// Centers the map on the San Francisco bay.
map.setCenter(-122.355537, 37.828, 9);

// Replaces the base map with a cleaner, custom map.
ui.root.clear();

var spacer = ui.SplitPanel(
  map, sidebar
) 

ui.root.add(spacer);

/*
  Init
  
  Initializes the app.
*/
change_section(0);