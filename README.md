# SummonerDash

This is a fullstack web application that allows users to search for League of Legends (LoL) players and view their statistics, including level, profile icon, rank, LP, win ratio, top 3 champions with highest mastery points, recent games' win ratio and roles, and game-specific information such as bought items, level, played champion, KDA, kill participation, CS, count of each ability and summoner spell usage, game mode, game duration, and the date the game was played. The application is built using React, Flask, and Riot API.

# Example of Use

![SummonerDash](https://github.com/wojwoj8/SummonerDash/assets/109290484/6f749d2d-b47e-4747-8c05-c61ae67ed25c)

## Features

- Search for LoL players by their username and region
- Display player information, including level, profile icon, rank, LP, and win ratio
- Show the top 3 champions with the highest mastery points for the player
- View recent games' win ratio and roles
- Detailed game information such as bought items, level, played champion, KDA, kill participation, CS, count of each ability and summoner spell usage, game mode, game duration, and date played
- Links to other players' profiles in the same game

## Technologies Used

- React: A JavaScript library for building user interfaces
- Flask: A micro web framework written in Python
- Riot API: An API provided by Riot Games for accessing LoL game data

## Data Sources

The following data sources were used in this application:

- Items data, summoner spells data, champions summary data, runes data, and icons and rank icons were obtained from [https://raw.communitydragon.org](https://raw.communitydragon.org)
- Queues info was obtained from [https://static.developer.riotgames.com/docs/lol/queues.json](https://static.developer.riotgames.com/docs/lol/queues.json)

## Riot API Endpoints

This application utilizes the following [Riot API endpoints](https://developer.riotgames.com/apis):

- `/lol/summoner/v4/summoners/by-name/`: Retrieves basic summoner data such as ID, icon ID, Puuid, and summoner level.
- `/lol/league/v4/entries/by-summoner/`: Fetches rank data from solo queue and flex queue, including wins, losses, tier, and more.
- `/lol/match/v5/matches/by-puuid/`: Retrieves the IDs of the last games played by the summoner.
- `/lol/match/v5/matches`: Fetches data from specific games.
- `/lol/champion-mastery/v4/champion-masteries/by-puuid/`: Retrieves the top 3 mastery data of a given player.

## Prerequisites

Before running the application, ensure you have the following prerequisites installed:

- Chromium browsers / other may not work
- Node.js: Install from [https://nodejs.org](https://nodejs.org)
- Python: Install from [https://www.python.org](https://www.python.org)

## Installation

1. Clone the repository:

> `git clone https://github.com/wojwoj8/SummonerDash.git`

2. Change to the project directory:

> `cd SummonerDash`

3. Install the dependencies for the frontend:

> `cd client`
>
> `npm install`

4. Install the dependencies for the backend:

> `cd ../flask-server`
>
> `pip install -r requirements.txt`

5. Obtain a Riot API key by signing up at [https://developer.riotgames.com](https://developer.riotgames.com).

6. In api_key.py paste your Riot API key, it should look like:

> API_KEY = "YOUR API KEY"

## Usage

1. Start the backend server:

> `cd backend`

> `python3 app.py`

2. In a separate terminal, start the frontend development server:

> `cd frontend`

> `npm start`

3. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to access the application.

4. Select region, type your League of Legends username and enjoy :)

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Riot Games](https://developer.riotgames.com) for providing the Riot API
- [Communitydragon](https://raw.communitydragon.org) for providing json files and images
- [React](https://reactjs.org) for the frontend development
- [Flask](https://flask.palletsprojects.com) for the backend development
