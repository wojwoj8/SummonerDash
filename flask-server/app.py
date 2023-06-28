from flask import Flask
from flask_cors import CORS, cross_origin
import requests
import math
import pprint
import re  # regex
import copy

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
api_key = "RGAPI-d434c357-cfe2-4872-b69d-af3c5bfeba6f"
pp = pprint.PrettyPrinter(indent=4)


# for before_request bercause there is no before_first_request
initialized = False


# need to be done before everything
@app.before_request
def changeAllPathsForItems():
    global initialized
    if not initialized:
        try:
            global itemsData
            global summonerSpellsData
            global championsSummary
            global queues
            global runesData
            global runesStyles

            itemsData = requests.get(
                "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json"
            ).json()
            summonerSpellsData = requests.get(
                "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json"
            ).json()
            path = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/"

            championsSummary = requests.get(
                "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json"
            ).json()

            queues = requests.get(
                "https://static.developer.riotgames.com/docs/lol/queues.json"
            ).json()

            runesData = requests.get(
                "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json"
            ).json()

            runesStyles = requests.get(
                "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json"
            ).json()["styles"]

            # Code to process the fetched data

        except requests.exceptions.RequestException as e:
            error_response = [
                {
                    "status": {
                        "message": "Error occurred during HTTP request",
                        "status_code": 500,
                    }
                }
            ]
            return error_response

        except ValueError as e:
            error_response = [
                {
                    "status": {
                        "message": "Error occurred while parsing JSON response",
                        "status_code": 500,
                    }
                }
            ]
            return error_response

        except Exception as e:
            error_response = [
                {
                    "status": {
                        "message": "An unexpected error occurred",
                        "status_code": 500,
                    }
                }
            ]
            return error_response
        # Code to handle the error condition

        dataList = [
            itemsData,
            summonerSpellsData,
            championsSummary,
            runesData,
            runesStyles,
        ]

        # for cutting last word of queue desc
        # More compact gamemode display
        stringList = ["5v5", "games", "3v3", "6v6", "Bot games", "Summoner's Rift"]

        for queue in queues:
            for string in stringList:
                if queue["description"] != None:
                    if string in queue["description"]:
                        queue["description"] = queue["description"].replace(string, "")
                else:
                    queue["description"] = "Custom"

        for data in dataList:
            for item in data:
                beforePath = item.get("squarePortraitPath", item.get("iconPath"))
                cutPath = beforePath.replace("/lol-game-data/assets/", "")
                lowPath = cutPath.lower()
                finalPath = path + lowPath
                fail = finalPath.rsplit("/", 1)[0]
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

    # check if error
    if "status" in player_info2:
        return

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


# fetch last 10 played games id
def fetchGamesIds(puuid, arr, region, start):
    region = regionToContinent(region)
    matchId_url = (
        "https://" + region + ".api.riotgames.com/lol/match/v5/matches/by-puuid/"
    )
    # can change count of fetched games
    matchId_url = (
        matchId_url + puuid + "/ids?start=" + start + "&count=10" "&api_key=" + api_key
    )
    resp = requests.get(matchId_url)
    gamesIds = resp.json()
    arr.append(gamesIds)

    if "status" in gamesIds:
        return


def queueType(id):
    id = int(id)
    err = [
        {
            "status": {
                "message": "Data not found - no queue found",
                "status_code": 404,
            }
        }
    ]

    queue = ""
    for q in queues:
        if q["queueId"] == id:
            queue = q
            return {"queueData": queue}

    return err


def fetchGamesData(arr, region):
    region = regionToContinent(region)
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
        [
            "perks",
        ],
    ]
    sublist_names = ["imgIds", "playerIdName", "runes"]

    for i in range(len(arr[0])):
        selectedGame_url = gameData_url + arr[0][i] + "?api_key=" + api_key

        resp = requests.get(selectedGame_url)

        gameData = resp.json()

        if "status" in gameData:
            arr.append(gameData)

            print("error in rate")
            return

        # 03.10.2022 00:00:00 ~ start of preseason 13
        # limitation to this date
        if gameData["info"]["gameCreation"] < 1664748000000:
            break

        # fetch all images here
        # return as participant_images or something like that
        players = gameData["info"]["participants"]
        # dict with all images as id (before fetch)
        test = []
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
                                    sublistData[key] = {
                                        "iconPath": "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/gp_ui_placeholder.png"
                                    }

                        elif re.search(r"1Id", key) or re.search(r"2Id", key):
                            for item in summonerSpellsData:
                                if item.get("id") == player[key]:
                                    sublistData[key] = item
                                    break
                                else:
                                    sublistData[key] = None

                        elif "championId" in key:
                            for item in championsSummary:
                                if item.get("id") == player[key]:
                                    sublistData[key] = item
                                    break
                                else:
                                    sublistData[key] = None

                        elif "perks" in key:
                            # i dont want to edit game data
                            sublistData[key] = copy.deepcopy(player[key])
                            statPerks = sublistData[key]["statPerks"]
                            mainRunes = sublistData[key]["styles"][0]["selections"]
                            secondaryRunes = sublistData[key]["styles"][1]["selections"]

                            # once for each player
                            # main runes - 4
                            for key, value in statPerks.items():
                                for item in runesData:
                                    if item.get("id") == value:
                                        statPerks[key] = item

                            for i in range(len(mainRunes)):
                                for item in runesData:
                                    if item.get("id") == mainRunes[i]["perk"]:
                                        mainRunes[i]["perk"] = item

                            for i in range(len(secondaryRunes)):
                                for item in runesData:
                                    if item.get("id") == secondaryRunes[i]["perk"]:
                                        secondaryRunes[i]["perk"] = item

                            for i in range(len(sublistData["perks"]["styles"])):
                                for item in runesStyles:
                                    if sublistData["perks"]["styles"][i][
                                        "style"
                                    ] == item.get("id"):
                                        sublistData["perks"]["styles"][i][
                                            "style"
                                        ] = item
                        else:
                            sublistData[key] = player[key]

                playerData[sublist_names[sublist_idx]] = sublistData

            test.append(playerData)

        # add queue type to gameData
        gameData.update(queueType(gameData["info"]["queueId"]))
        gameData.update({"allPlayerImgIds": test})

        # NOW ATTACH IMAGES LINKS TO ALL THOSE IDS

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
        err = [
            {
                "status": {
                    "message": "Data not found - no region found",
                    "status_code": 404,
                }
            }
        ]
        return err
    data = []
    fetch1(name, region, data)
    try:
        data[0]["id"]
    except KeyError:
        return data

    fetch2(data, region)

    # if error
    if "status" in data[1]:
        data[0].update(data[1])
        return data

    fetchIcon(data)
    fetchTop3Masteries(region, data)

    if "status" in data[2]:
        # riot endpoint bug if no entries, only on wojwoj8 euw for some reason
        if (
            data[2]["status"]["message"]
            == "Data not found - Server cannot locate endpoint - possibly a configuration issue"
        ):
            data[2] = []

            return data
        else:
            data[0].update(data[2])
        return data
    return data


@app.route("/gamesData/<region>/<name>/<start>", methods=["GET"])
def Games(name, region, start):
    data = []
    gamesData = []
    fetch1(name, region, data)
    try:
        data[0]["id"]
    except KeyError:
        return data
    fetchGamesIds(data[0]["puuid"], gamesData, region, start)

    if "status" in gamesData[-1]:
        return gamesData[0]

    fetchGamesData(gamesData, region)
    # remove games id because it is after fetch in json
    gamesData.pop(0)
    return gamesData


@app.route("/gameData/icons/<id>", methods=["GET"])
def Game(id):
    icon_url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/"
    icon = icon_url + id + ".png"
    icon = {"playerIcon": icon}
    return icon


def fetchTop3Masteries(region, arr):
    base_url = (
        "https://"
        + region
        + ".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/"
    )
    puuid = arr[0]["puuid"]
    masteries = base_url + puuid + "/top?count=3" + "&api_key=" + api_key
    resp = requests.get(masteries).json()

    if "status" in resp:
        arr.append(resp)
        return

    for i, champ in enumerate(resp):
        for data in championsSummary:
            if data.get("id") == champ["championId"]:
                copyData = data.copy()
                resp[i].update(copyData)

    arr.append(resp)

    if "status" in resp:
        return

    return arr


if __name__ == "__main__":
    app.run(debug=True)
