const EE_MAP_PATH = 'https://earthengine.googleapis.com/v1alpha';

var map = null

function initialize_map(mapid, token) {
  // Create an ImageOverlay using the MapID and token we got from App Engine.
  const tileSource = new ee.layers.EarthEngineTileSource({
    mapid,
    token,
    formatTileUrl: (x, y, z) =>
      `${EE_MAP_PATH}/${mapid}/tiles/${z}/${x}/${y}`
  });
  const layer = new ee.layers.ImageOverlay(tileSource);

  // sets the map center to the San Francisco bay
  const mapOptions = {
    center: new google.maps.LatLng(37.80, -122.27),
    zoom: 10,
    maxZoom: 18,
    streetViewControl: false,
    mapTypeId: "terrain"
  };

  // Create the base Google Map.
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Add the EE layer to the map.
  map.overlayMapTypes.push(layer);
  //map.overlayMapTypes.pop(layer);
};
