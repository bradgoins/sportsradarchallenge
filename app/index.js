const app = require('./server');
const port = process.env['API_PORT'];
const client = require('./db_client');
const { migrate } = require("postgres-migrations")
const scheduleFeed = require('./jobs/monitor_schedule_feed');

app.listen(port, async () => {
    console.log(`Listen on the port ${port}...`);

    // connect to database;
    await client.connect();

    // run migrations
    await migrate({client}, "migrations");

    // scheduleFeed.process();
});