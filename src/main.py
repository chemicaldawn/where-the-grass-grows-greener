from flask import Flask
from flask import render_template, send_file, escape

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

# Allows all files in the "static" directory to be accessed by the client. 
# DO NOT put sensitive files (such as key files) inside the "static" directory.

@app.route("/static/<path>", methods=['GET'])
def map_styling(path):
    return send_file("static/" + escape(path))

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)