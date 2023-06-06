from flask import Flask
from flask_cors import CORS, cross_origin
import sqlite3
import requests
import json

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
api_key = "RGAPI-05d42d59-2179-44da-b8dc-7298848e0b00"

# @app.route("/", methods=["GET","POST"])
# @cross_origin()
# def index():
#     return


@app.route("/name/<name>", methods=["GET", "POST"])
@cross_origin()
def test(name):
    data = []
    api_url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    api_url = api_url + name + "?api_key=" + api_key
    resp = requests.get(api_url)

    api_url2 = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/"

    player_info = resp.json()
    data.append(player_info)
    # data = json.loads(player_info)
    # print(data["id"])
    print(player_info["id"])
    api_url2 = api_url2 + player_info["id"] + "?api_key=" + api_key
    print(api_url2)
    resp2 = requests.get(api_url2)

    player_info2 = resp2.json()

    data.append(player_info2)
    return data


if __name__ == "__main__":
    app.run(debug=True)
