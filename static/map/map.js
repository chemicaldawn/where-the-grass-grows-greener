const EE_MAP_PATH = 'https://earthengine.googleapis.com/v1alpha';

var map = null
var click_marker = null

var map_layers = {

}

function get_json(path) {
  return fetch(path).then(response => {
    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return response.json();
    })
}

function initialize_layers(layers) {

  json_map_layers = JSON.parse(layers.replaceAll("&#34;",'"'))
  console.log(json_map_layers)

  for (const [name,values] of Object.entries(json_map_layers)) {
    tile_source = new ee.layers.EarthEngineTileSource({
      mapid: values['mapid'],
      token: values['token'],
      formatTileUrl: (x, y, z) =>
        `${EE_MAP_PATH}/${values['mapid']}/tiles/${z}/${x}/${y}`
    });

    map_layers[name] = new ee.layers.ImageOverlay(tile_source);
  }
}

function initialize_map() {
  // Create an ImageOverlay using the MapID and token we got from App Engine.

  // load the map styling and initialize the map
  // an external map styling file is used to keep the code looking clean
  get_json("/static/map/map_styling.json").then(json => {

    map = new google.maps.Map(document.getElementById('map'), {
      
      // sets the map center to the San Francisco Bay Area
      center: new google.maps.LatLng(37.80, -122.27),
      zoom: 10,
      maxZoom: 18,
  
      // sets up the map controls, enabling only the fullscreen and zoom controls
      streetViewControl: false,
      scaleControl: true,
      mapTypeControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },

      // sets the cursor type to the crosshair
      draggableCursor:'crosshair',
      draggingCursor:'crosshair',
  
      // sets the style to the json stylesheet we just fetched
      styles: json,
  
      // sets the base map type to the default Google Maps road map
      mapTypeId: "roadmap"
    });

    initialize_event_listeners();
  })
};

function initialize_event_listeners() {
  google.maps.event.addListener(map, 'click', function(event) {

    if(click_marker) {
      click_marker.setMap(null);
    }
  
    click_marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
  
    click_marker.setMap(map);
  });
} 

function set_layer(name = null) {
  map.overlayMapTypes.pop();

  if(name != null && name != "None") {
    map.overlayMapTypes.push(map_layers[name]);
  }
}

function clear_layer() {
  set_layer(null);
}