"""
* Carol Lei & Kenny "Ackerson" Le
* 11/19/20
* Twitter Trends React
* Description: HCDE 310 Final Project — Provides Twitter trends and mapping information for
* Twitter Trends Mapper
"""

import json
import tweepy
import googlemaps
import os
from flask import Flask

app = Flask(__name__, static_folder="./build", static_url_path="/")

with open("API_Keys.json") as json_file:
    file = json.load(json_file)
    # Google Maps Authentication
    _gmaps_key = file["Google Maps API"]
    gmaps = googlemaps.Client(key=_gmaps_key)

    # Twitter Authentication (with Tweepy)
    _twitter_key = file["Twitter API key"]
    _twitter_secret = file["Twitter secret"]
    _twitter_bear_token = file["Twitter bear_token"]
    auth = tweepy.OAuthHandler(_twitter_key, _twitter_secret)
    api = tweepy.API(auth, wait_on_rate_limit=False)


def get_lat_long(location):
    """
    Takes a location and returns the latitude and longitude coordinates
    """
    geo_info = gmaps.geocode(location)
    coords = geo_info[0]["geometry"]["location"]
    return coords["lat"], coords["lng"]


@app.route("/get_location/<path:coordinates>")
def get_location(coordinates):
    """
    Takes a latitude and longitude coordinate and returns a
    list of addresses at that location as a JSON
    """
    app.logger.info(coordinates)
    app.logger.info(type(coordinates))
    locations = json.load(open("static/locations.json"))
    if coordinates in locations:
        location = locations[coordinates]
        return json.dumps(location[1:-1])
    else:
        location_info = gmaps.reverse_geocode(latlng=coordinates)
        for location in location_info:
            if "locality" in location["types"]:
                return json.dumps(location["formatted_address"])


def get_location_trend_list(lat, long):
    """
    Takes a latitude and longitude coordinate and returns a list of trends near that location
    """
    closest_loc = api.trends_closest(lat, long)
    trends = api.trends_place(closest_loc[0]['woeid'])
    trend_names_vol = dict()
    for trend in trends[0]['trends']:
        if trend['tweet_volume'] is not None:
            trend_names_vol[trend['name']] = trend['tweet_volume']
    return trend_names_vol


def get_trends():
    """
    Returns all available trends
    """
    return api.trends_available()


@app.route("/get_cities/<path:trend>")
def get_city_trends(trend):
    """
    Takes a trend and returns all the cities in which it is trending as a JSON
    """
    city_with_trends = list()
    for coord in trends_per_coord:
        app.logger.info(coord)
        app.logger.info(type(coord))
        if any(trend in trend_list for trend_list in coord):
            city_with_trends.append(coord)
    return json.dumps({"coord_list": city_with_trends, "center_coord": (39.8283, -98.5759)})


@app.route("/data")
def display_map():
    """
    Returns all the coordinates for top trends in the United States as a JSON
    """
    locations = json.load(open("static/locations.json"))
    reverse_locations = dict((v, k) for k, v in locations.items())
    cities = [city for city in locations.values()]
    for place in US_CITIES:
        if any(place["name"] in city for city in cities):
            full_city = ""
            for city in cities:
                if place["name"] in city:
                    full_city = city
                    break
            coords = reverse_locations[full_city].split(",")
            lat = float(coords[0])
            long = float(coords[1])
            COORDINATES_LIST.append((lat, long))
        else:
            COORDINATES_LIST.append(get_lat_long(place["name"]))
    print(COORDINATES_LIST)
    return json.dumps({"coord_list": COORDINATES_LIST, "center_coord": (39.8283, -98.5759)})


@app.route("/trends/<path:coordinates>")
def display_trends(coordinates):
    """
    Takes coordinates from React and returns the trends as a JSON for that location
    """
    coords = coordinates.split(",")
    lat = coords[0]
    lng = coords[1]
    app.logger.info(f"Coordinates: {lat}, {lng}")
    trends = get_location_trend_list(lat, lng)
    app.logger.info(f"Trends: {trends}")
    return json.dumps(trends)


@app.route("/ustrends")
def display_us_trends():
    """
    Displays the top trends in the United States and their tweet volume
    """
    united_states = 23424977
    trends = api.trends_place(united_states)
    us_trends = dict()
    for trend in trends[0]["trends"]:
        if trend["tweet_volume"] is not None:
            us_trends[trend["name"]] = trend["tweet_volume"]
    return json.dumps(us_trends)


# Declared global variables to reduce unnecessary API calls
US_CITIES = [trend for trend in get_trends() if trend["countryCode"] == "US"]
COORDINATES_LIST = list()
trends_per_coord = dict()


@app.route("/")
def index():
    return app.send_static_file("index.html")


def main():
    print("Hello World")


if __name__ == "__main__":
    # main()
    # app.run(port=5000, debug=True)
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("Port", 80))
