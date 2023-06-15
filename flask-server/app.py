from flask import Flask, render_template, send_from_directory, request
from flask_cors import CORS, cross_origin
import os
import sqlite3
import requests
import json
import math
import pprint
import re  # regex

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
api_key = "RGAPI-19302a19-ab1d-4f47-9aff-702835468cd3"
pp = pprint.PrettyPrinter(indent=4)

# has to be global as reference for items fetching

# for before_request bercause there is no before_first_request
initialized = False


# need to be done before everything
@app.before_request
def changeAllPathsForItems():
    global initialized
    if not initialized:
        global itemsData
        global summonerSpellsData
        global championsIcons
        global queues
        itemsData = requests.get(
            "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json"
        ).json()

        # global reference for summ spells data
        summonerSpellsData = requests.get(
            "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json"
        ).json()
        path = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/"

        championsIcons = requests.get(
            "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json"
        ).json()

        queues = requests.get(
            "https://static.developer.riotgames.com/docs/lol/queues.json"
        ).json()

        dataList = [itemsData, summonerSpellsData, championsIcons]

        # for cutting last word of queue desc
        for queue in queues:
            if queue["description"] != None:
                queue["description"] = queue["description"].rsplit(" ", 1)[0]

        for data in dataList:
            for item in data:
                beforePath = item.get("squarePortraitPath", item.get("iconPath"))
                cutPath = beforePath.replace("/lol-game-data/assets/", "")
                lowPath = cutPath.lower()
                finalPath = path + lowPath
                fail = finalPath.rsplit("/", 1)[0]
                # print(fail)
                item["squarePortraitPath"] = (
                    finalPath if "squarePortraitPath" in item else fail + "-1.png"
                )
                item["iconPath"] = finalPath

        initialized = True


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


def queueType(id):
    id = int(id)
    queue = ""
    for q in queues:
        if q["queueId"] == id:
            queue = q
            return {"queueData": queue}
    return {"err": "no queue found"}


def fetchGamesData(arr, region):
    region = regionToContinent(region)
    # print(region)
    gameData_url = "https://" + region + ".api.riotgames.com/lol/match/v5/matches/"

    dataToCopy = [
        [
            "championId",
            "item0",
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "summoner1Id",
            "summoner2Id",
        ],
        [
            "summonerId",
            "summonerName",
        ],
    ]
    sublist_names = ["imgIds", "playerIdName"]

    for i in range(len(arr[0])):
        selectedGame_url = gameData_url + arr[0][i] + "?api_key=" + api_key

        # print(selectedGame_url)
        resp = requests.get(selectedGame_url)
        gameData = resp.json()

        # 03.10.2022 00:00:00 ~ start of preseason 13
        if gameData["info"]["gameCreation"] < 1664748000000:
            # print(gameData["info"]["gameCreation"])
            break

        # queueType(gameData["info"]["queueId"])
        # queueType(gameData.info.queueId):
        # fetch all images here
        # return as participant_images or something like that
        players = gameData["info"]["participants"]
        # print(len(players))

        # dict with all images as id (before fetch)
        test = []
        fetchedData = []
        # players data, want to get all img ids and change to images
        for player in players:
            playerData = {}
            for sublist_idx, sublist in enumerate(dataToCopy):
                sublistData = {}
                for key in sublist:
                    if key in player:
                        if re.search(r"item", key):
                            for item in itemsData:
                                if item.get("id") == player[key]:
                                    sublistData[key] = item
                                    break
                                else:
                                    sublistData[key] = None

                        elif re.search(r"1Id", key) or re.search(r"2Id", key):
                            for item in summonerSpellsData:
                                if item.get("id") == player[key]:
                                    # print(item)
                                    sublistData[key] = item
                                    break
                                else:
                                    sublistData[key] = None

                        elif "championId" in key:
                            for item in championsIcons:
                                if item.get("id") == player[key]:
                                    # print(item)
                                    sublistData[key] = item
                                    break
                                else:
                                    sublistData[key] = None
                        else:
                            sublistData[key] = player[key]

                        # print(sublistData)
                playerData[sublist_names[sublist_idx]] = sublistData

            test.append(playerData)

        # add queue type to gameData
        gameData.update(queueType(gameData["info"]["queueId"]))
        gameData.update({"allPlayerImgIds": test})
        # print(test)

        # NOW ATTACH IMAGES LINKS TO ALL THOSE IDS
        arr.append(gameData)

        # arr.append(test)


# def fetchItemData(itemId):


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


if __name__ == "__main__":
    app.run(debug=True)
