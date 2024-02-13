# [START gae_python38_app]
# [START gae_python3_app]

from flask import Flask
from flask import render_template

import cfg.config as cfg
import ee

app = Flask(__name__)
app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route("/")
def main():

    ee.Initialize(cfg.EE_CREDENTIALS)
    mapid = ee.Image('srtm90_v4').getMapId({'min': 0, 'max': 1000})

    return render_template("legacy_map_view.html", 
        mapid=mapid['mapid'],
        token=mapid['token'],
        maps_key=cfg.MAPS_CREDENTIALS)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)

# [END gae_python3_app]
# [END gae_python38_app]
