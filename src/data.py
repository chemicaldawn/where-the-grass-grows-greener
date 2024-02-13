import ee

map_layers = {}
rendered_map_layers = {}

class MapLayer:

    name : str = "Map Layer"
    image_data : ee.Image

    styling : dict = {}

    def __init__(self, name, image_data : ee.Image, default_styling : dict) -> None:
        self.name = name
        self.image_data = image_data
        self.styling = default_styling

        map_layers[name] = self

    def set_styling(self, styling):
        self.styling = styling

    def render(self):
        return self.image_data.getMapId(self.styling)

def initialize_map_layers():
    MapLayer("Canopy",
        ee.Image("NASA/JPL/global_forest_canopy_height_2005").select("1"),
        {'min': 0, 'max': 30, 'palette': [
        'ffffff00', 'fcd163', '99b718', '66a000', '3e8601', '207401', '056201','004c00', '011301'
    ]})
    
def render_map_layers():

    for name,layer in map_layers.items():

        layer_object = layer.render()

        rendered_map_layers[name] = {
            'mapid': layer_object['mapid'],
            'token': layer_object['token']
        }