const express = require('express')
const client = require('./db_client');
const { migrate } = require("postgres-migrations")
const scheduleFeed = require('./jobs/monitor_schedule_feed');

const port = process.env['API_PORT'];
const app = express()

// dabtabase connection instance.


// list to api requests
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, async () => {
    console.log(`Listen on the port ${port}...`);

    // connect to database;
    await client.connect();

    // run migrations
    await migrate({client}, "migrations");

    scheduleFeed.process();
});

// https://statsapi.web.nhl.com/api/v1/seasons
// https://statsapi.web.nhl.com/api/v1/seasons/current
// https://statsapi.web.nhl.com/api/v1/schedule?season=20222023
// https://statsapi.web.nhl.com/api/v1/game/2022030175/boxscore