from flask import Flask, render_template, send_from_directory
from flask_cors import CORS, cross_origin
import os
import sqlite3
import requests
import json
import math
import pprint

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
api_key = "RGAPI-d4d3d5be-6d1d-45cd-b865-14c1daf324f3"
pp = pprint.PrettyPrinter(indent=4)


def mapAssetsPath(path):
    default = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/"

    # cut prefix
    cutPath = path.replace("/lol-game-data/assets/", "")
    # toLower
    lowPath = cutPath.lower()
    finalPath = default + lowPath
    finalPath = {"iconImg": finalPath}
    return finalPath


# ID, Acc ID, Puuid, name, icon ID, revison date, summoner level
def fetch1(name, region, arr):
    api_url = (
        "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    )
    api_url = api_url + name + "?api_key=" + api_key
    resp = requests.get(api_url)
    player_info = resp.json()
    arr.append(player_info)


# this is array with both two indexes: soloQ and flex
# leagueId, queueType, tier, rank, summonerId, summonerName, leaguePoints, wins,
# losses, veteran, inactive, freshBlood, hotStreak, rank icon
def fetch2(arr, region):
    rankIconBase = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/"
    api_url2 = (
        "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/"
    )

    api_url2 = api_url2 + arr[0]["id"] + "?api_key=" + api_key

    resp2 = requests.get(api_url2)
    player_info2 = resp2.json()

    arr.append(player_info2)

    for i in range(len(player_info2)):
        rank = player_info2[i]["tier"].lower()
        rankIcon = rankIconBase + rank + ".png"
        rankIcon = {"rankIcon": rankIcon}

        winrate = math.ceil(
            (
                player_info2[i]["wins"]
                / (player_info2[i]["wins"] + player_info2[i]["losses"])
            )
            * 100
        )

        winrate = {"winrate": winrate}
        # print(f"\narr[1][{i}]: {arr[1][i]}\n")
        arr[1][i].update(rankIcon)
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


# fetch last 20 played games id
def fetchGamesIds(puuid, arr, region):
    region = regionToContinent(region)
    matchId_url = (
        "https://" + region + ".api.riotgames.com/lol/match/v5/matches/by-puuid/"
    )
    # can change count of fetched games
    matchId_url = matchId_url + puuid + "/ids?start=0&count=5" "&api_key=" + api_key
    resp = requests.get(matchId_url)
    gamesIds = resp.json()
    arr.append(gamesIds)


def fetchGamesData(arr, region):
    region = regionToContinent(region)
    # print(region)
    gameData_url = "https://" + region + ".api.riotgames.com/lol/match/v5/matches/"
    for i in range(len(arr[0])):
        selectedGame_url = gameData_url + arr[0][i] + "?api_key=" + api_key
        # print(selectedGame_url)
        resp = requests.get(selectedGame_url)
        gameData = resp.json()

        arr.append(gameData)


def checkRegionExists(region):
    if region not in [
        "na1",
        "br1",
        "lan1",
        "las1",
        "kr",
        "jp1",
        "eun1",
        "euw1",
        "tr1",
        "ru1",
        "oc1",
        "ph2",
        "sg2",
        "th2",
        "tw2",
        "vn2",
    ]:
        return "error"


def regionToContinent(region):
    if region in ["na1", "br1", "lan1", "las1"]:
        region = "americas"

    elif region in ["kr", "jp1"]:
        region = "asia"

    elif region in ["eun1", "euw1", "tr1", "ru1"]:
        region = "europe"

    elif region in ["oc1", "ph2", "sg2", "th2", "tw2", "vn2"]:
        region = "sea"

    return region


# REMEMBER TO MAKING DIFFERENT ENDPOINT URL FOR FETCH AND RENDER
@app.route("/userData/<region>/<name>", methods=["GET"])
@cross_origin()
def profile(name, region):
    if checkRegionExists(region) == "error":
        return {"err": "This region does not exist"}
    # print(region)
    data = []
    fetch1(name, region, data)
    try:
        data[0]["id"]
    except KeyError:
        # print(data)
        return {"err": "summoner not found"}

    fetch2(data, region)
    fetchIcon(data)

    # print(gamesData[1])

    # pp.pprint(data)
    # pp.pprint(gamesData)
    # print("")

    return data


@app.route("/gamesData/<region>/<name>", methods=["GET"])
def Games(name, region):
    data = []
    gamesData = []
    fetch1(name, region, data)
    try:
        data[0]["id"]
    except KeyError:
        return {"err": "summoner not found"}
    fetchGamesIds(data[0]["puuid"], gamesData, region)

    fetchGamesData(gamesData, region)
    # remove games id because it is after fetch in json
    gamesData.pop(0)
    # pp.pprint(gamesData)
    return gamesData


@app.route("/gameData/icons/<id>", methods=["GET"])
def Game(id):
    icon_url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/"
    icon = icon_url + id + ".png"
    # print(id)
    icon = {"playerIcon": icon}
    return icon


@app.route("/gameData/queueType/<id>", methods=["GET"])
def queueType(id):
    queues = requests.get("https://static.developer.riotgames.com/docs/lol/queues.json")
    queues = queues.json()
    id = int(id)
    queue = ""
    for q in queues:
        # print(type(q["queueId"]))
        # print(type(id))

        if q["queueId"] == id:
            # print(q)
            queue = q
            queue["description"] = queue["description"].rsplit(" ", 1)[0]
            return queue

    print("no")
    return {"err": "no queue found"}


if __name__ == "__main__":
    app.run(debug=True)
