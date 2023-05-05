const axios = require('axios');

const getGameData = async(game) => {
    const gameResults = (await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${game.gamePk}/feed/live`)).data;
    return gameResults.gameData
}

module.exports = {
    getGameData
}