from flask import Flask
from flask_cors import CORS, cross_origin
import sqlite3
import requests
import json
import math
import pprint

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
api_key = "RGAPI-1c88a664-1f0d-4b9f-ab83-ab2e813f65a8"

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


# ID, Acc ID, Puuid, name, icon ID, revison date, summoner level
def fetch1(name, arr):
    api_url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    api_url = api_url + name + "?api_key=" + api_key
    resp = requests.get(api_url)
    player_info = resp.json()
    arr.append(player_info)


# this is array with both two indexes: soloQ and flex
# leagueId, queueType, tier, rank, summonerId, summonerName, leaguePoints, wins,
# losses, veteran, inactive, freshBlood, hotStreak
def fetch2(arr):
    api_url2 = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/"

    api_url2 = api_url2 + arr[0]["id"] + "?api_key=" + api_key

    resp2 = requests.get(api_url2)
    player_info2 = resp2.json()

    arr.append(player_info2)

    for i in range(len(player_info2)):
        winrate = math.ceil(
            (
                player_info2[i]["wins"]
                / (player_info2[i]["wins"] + player_info2[i]["losses"])
            )
            * 100
        )

        winrate = {"winrate": winrate}
        # print(f"\narr[1][{i}]: {arr[1][i]}\n")
        arr[1][i].update(winrate)


# ALL ICONS DATA
def fetchIcon(arr):
    resp3 = requests.get(
        "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-icons.json"
    )
    resp3 = resp3.json()
    for i in range(len(resp3)):
        if resp3[i]["id"] == arr[0]["profileIconId"]:
            icon = resp3[i]

    iconImg = mapAssetsPath(icon["imagePath"])
    arr[0].update(iconImg)


@app.route("/name/<name>", methods=["GET", "POST"])
@cross_origin()
def profile(name):
    data = []

    fetch1(name, data)
    try:
        data[0]["id"]
    except KeyError:
        return {"err": "summoner not found"}
    fetch2(data)
    fetchIcon(data)

    combinedData = {}
    # print(data)

    for item in data:
        if isinstance(item, dict):
            merge_dict(combinedData, item)

    # for i in range(len(data)):
    #     print(f"\nData[{i}]: {data[i]}\n")
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(data)
    # pp.pprint(data[0])
    print("")
    # pp.pprint(data[1])
    # print(f"\n{data}\n")
    # print(f"\n{combinedData}\n")
    return data


if __name__ == "__main__":
    app.run(debug=True)
