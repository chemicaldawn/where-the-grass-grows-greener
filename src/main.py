from flask import Flask
from flask import render_template, send_file
import json
import ee

import data
import cfg.config as cfg

app = Flask(__name__)
app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route("/")
def main():

    ee.Initialize(cfg.EE_CREDENTIALS)
    
    data.initialize_map_layers()
    data.render_map_layers()

    print(json.dumps(data.rendered_map_layers))

    return render_template("legacy_map_view.html", 
        layers = json.dumps(data.rendered_map_layers),
        maps_key = cfg.MAPS_CREDENTIALS)

# Allows all files in the "static" directory to be accessed by the client. 
# DO NOT put sensitive files (such as key files) inside the "static" directory.

@app.route("/static/<path>", methods=['GET'])
def map_styling(path):
    return send_file("static/" + path)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)