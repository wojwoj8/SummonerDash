from flask import Flask
from flask_cors import CORS, cross_origin
import sqlite3
import requests
import json
import math

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
api_key = "RGAPI-e81f7d4d-6582-4b61-bce2-a79a902f4cbc"

# @app.route("/", methods=["GET","POST"])
# @cross_origin()
# def index():
#     return


def mapAssetsPath(path):
    default = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/"

    # cut prefix
    cutPath = path.replace("/lol-game-data/assets/", "")
    # toLower
    lowPath = cutPath.lower()
    finalPath = default + lowPath
    finalPath = {"iconImg": finalPath}
    return finalPath


def merge_dict(target, source):
    for key, value in source.items():
        if isinstance(value, dict):
            nested_target = target.setdefault(key, {})
            merge_dict(nested_target, value)
        else:
            target[key] = value


@app.route("/name/<name>", methods=["GET", "POST"])
@cross_origin()
def profile(name):
    data = []
    # ID, Acc ID, Puuid, name, icon ID, revison date, summoner level
    api_url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    api_url = api_url + name + "?api_key=" + api_key
    resp = requests.get(api_url)
    player_info = resp.json()
    data.append(player_info)

    # leagueId, queueType, tier, rank, summonerId, summonerName, leaguePoints, wins,
    # losses, veteran, inactive, freshBlood, hotStreak
    api_url2 = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/"
    # print(player_info["id"])
    api_url2 = api_url2 + player_info["id"] + "?api_key=" + api_key
    # print(api_url2)
    resp2 = requests.get(api_url2)
    player_info2 = resp2.json()
    player_info2 = player_info2[0]
    data.append(player_info2)

    # ALL ICONS DATA
    resp3 = requests.get(
        "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-icons.json"
    )
    resp3 = resp3.json()
    for i in range(len(resp3)):
        if resp3[i]["id"] == player_info["profileIconId"]:
            icon = resp3[i]
    # print(resp3[0])
    iconImg = mapAssetsPath(icon["imagePath"])

    # print(icon)

    # icon path before mapping: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/

    data.append(iconImg)

    winrate = math.ceil(
        (player_info2["wins"] / (player_info2["wins"] + player_info2["losses"])) * 100
    )

    winrate = {"winrate": winrate}
    data.append(winrate)
    combinedData = {}

    for item in data:
        if isinstance(item, dict):
            merge_dict(combinedData, item)

    for i in range(len(data)):
        print(f"\nData[{i}]: {data[i]}\n")
    # print(f"\n{data}\n")
    print(f"\n{combinedData}\n")
    return combinedData


if __name__ == "__main__":
    app.run(debug=True)
