const { upsertPlayers } = require('./upsert_players');
const { getBoxscore } = require('./get_boxscores');

const updateGameData = async(game) => {
    const gameResults = await getBoxscore(game)

    await upsertPlayers(game, gameResults?.teams?.home);
    await upsertPlayers(game, gameResults?.teams?.away);
}

module.exports = {
    updateGameData
}