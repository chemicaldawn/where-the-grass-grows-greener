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
    
def render_map_layers():

    for name,layer in map_layers.items():

        layer_object = layer.render()

        rendered_map_layers[name] = {
            'mapid': layer_object['mapid'],
            'token': layer_object['token']
        }

def initialize_map_layers():
    MapLayer("Green Space Classification",
        ee.Image('projects/nasa-eej/assets/EEJGreenSpaceClassificationR2'),
        {'min': 1, 'max': 3, 
         'labels' : ['Green Space','Water','Urban / Impervious'],
         'palette': ['5fba4a', 'a0baf9', 'c9c9c9']
        })