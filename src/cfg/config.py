import ee
from json import load

try:
    open("cfg/keys/earth_engine_key.json")
    open("cfg/keys/maps_key.json")
except:
    exception = Exception("Key files not found! Make sure to put earth_engine_key.json and maps_key.json in the root of the keys folder for API access.") 
    raise exception
    exit()

maps_file = open("cfg/keys/maps_key.json")
earth_engine_file = open("cfg/keys/earth_engine_key.json")

MAPS_CREDENTIALS = load(maps_file)["private_key"]
EE_CREDENTIALS = ee.ServiceAccountCredentials(load(earth_engine_file)["client_email"], 'cfg/keys/earth_engine_key.json')

maps_file.close()
earth_engine_file.close()