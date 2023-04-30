const pg = require('pg');

const client = new pg.Client({
    database: process.env['POSTGRES_DB'],
    user: process.env['POSTGRES_USERNAME'],
    password:process.env['POSTGRES_PASSWORD'],
    host: process.env['POSTGRES_HOST'],
    port: process.env['POSTGRES_PORT'],
})

module.exports = client