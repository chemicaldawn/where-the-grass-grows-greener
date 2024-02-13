const EE_MAP_PATH = 'https://earthengine.googleapis.com/v1alpha';

var map = null

function get_json(path) {
  fetch(path).then(response => {
    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return response.json();
    })
    .then(json => {
        return json
    })
}

function initialize_map(mapid, token) {
  // Create an ImageOverlay using the MapID and token we got from App Engine.
  const tileSource = new ee.layers.EarthEngineTileSource({
    mapid,
    token,
    formatTileUrl: (x, y, z) =>
      `${EE_MAP_PATH}/${mapid}/tiles/${z}/${x}/${y}`
  });
  const layer = new ee.layers.ImageOverlay(tileSource);

  console.log(get_json("/map-styling.json"))

  const mapOptions = {

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

    // sets the base map type to the default Google Maps road map
    mapTypeId: "roadmap"
  };

  // Create the base Google Map.
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Add the EE layer to the map.
  map.overlayMapTypes.push(layer);
  //map.overlayMapTypes.pop(layer);
};
