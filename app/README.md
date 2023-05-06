# Sports Radar Coding Challenge

This project is inteded to satisfy the requirement found at the following URI: https://github.com/sportradarus/sportradar-advanced-challenge

## Startup

This project comes with a `docker-compose.yml` file for convenience. Docker will be needed to be installed. Open a terminal, navigate to the project root and type the folloing command `docker-compose up -d`.

Alternatively, if you have a postgres database and node is running, simply update the `.env` file with the relavent information. Start the project with `npm run start`

## Usage

Once the project is running, it will automatically start pulling down the current seasons schedule and games.

If you want to pull down a previous season an API has been made available. `POST` to `http://localhost:3000/seasons/:seasonId`

To query the a games information `GET` to `http://localhost:3000/games/:gamePk`

## Gaps

Every effort was made to fulfill the requirements set forth. That being said there is a lot of improvements to me made. The API is limited and doesn't proved many features. The testing covers the most critical parts of the app and gives a sample representation of my testing approach, but the coverage is still lacking. Some things were mocked for convenience.

If the project was to grow, a more throughtful organization of the files is projbably necessary.

## Bugs

There is a knows bug with the ingest process. Duplicat records can be created throught the `upsert` logic.