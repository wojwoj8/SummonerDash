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
api_key = "RGAPI-81e42739-7951-4c88-99e2-05e28e27ed7f"
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
def fetch1(name, arr):
    api_url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    api_url = api_url + name + "?api_key=" + api_key
    resp = requests.get(api_url)
    player_info = resp.json()
    arr.append(player_info)


# this is array with both two indexes: soloQ and flex
# leagueId, queueType, tier, rank, summonerId, summonerName, leaguePoints, wins,
# losses, veteran, inactive, freshBlood, hotStreak, rank icon
def fetch2(arr):
    rankIconBase = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/"
    api_url2 = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/"

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
def fetchGamesIds(puuid, arr):
    matchId_url = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/"
    # can change count of fetched games
    matchId_url = matchId_url + puuid + "/ids?start=0&count=5" "&api_key=" + api_key
    resp = requests.get(matchId_url)
    gamesIds = resp.json()
    arr.append(gamesIds)


def fetchGamesData(arr):
    gameData_url = "https://europe.api.riotgames.com/lol/match/v5/matches/"
    for i in range(len(arr[0])):
        selectedGame_url = gameData_url + arr[0][i] + "?api_key=" + api_key
        # print(selectedGame_url)
        resp = requests.get(selectedGame_url)
        gameData = resp.json()

        arr.append(gameData)


# REMEMBER TO MAKING DIFFERENT ENDPOINT URL FOR FETCH AND RENDER
@app.route("/userData/<name>", methods=["GET"])
@cross_origin()
def profile(name):
    data = []
    fetch1(name, data)
    try:
        data[0]["id"]
    except KeyError:
        print(data)
        return {"err": "summoner not found"}

    fetch2(data)
    fetchIcon(data)

    # print(gamesData[1])

    # pp.pprint(data)
    # pp.pprint(gamesData)
    print("")

    return data


@app.route("/gamesData/<name>", methods=["GET"])
def Games(name):
    data = []
    gamesData = []

    fetch1(name, data)
    try:
        data[0]["id"]
    except KeyError:
        return {"err": "summoner not found"}
    fetchGamesIds(data[0]["puuid"], gamesData)

    fetchGamesData(gamesData)
    # remove games id because it is after fetch in json
    gamesData.pop(0)
    print(gamesData)
    return gamesData


if __name__ == "__main__":
    app.run(debug=True)
