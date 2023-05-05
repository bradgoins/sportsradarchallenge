const axios = require('axios');

const getBoxscore = async(game) => {
    return (await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${game.game.pk}/boxscore`)).data;    
}

module.exports = {
    getBoxscore
}