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


});
