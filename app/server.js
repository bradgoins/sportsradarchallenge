const express = require('express')
const seasonController = require('./controllers/season.controller')
const gameController = require('./controllers/game.controller')

const app = express()

// list to api requests
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/seasons/:id', seasonController.startFeed);

app.get('/games/:id', gameController.getGameStats);

module.exports = app;