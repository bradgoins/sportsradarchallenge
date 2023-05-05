const { upsertTeam } = require('./upsert_team');
const { upsertPlayers } = require('./upsert_players');
const { upsertStats } = require('./upsert_game_stats');
const { getBoxscore } = require('./get_boxscores');

const updateGameData = async(game) => {
    const gameResults = await getBoxscore(game)

    await upsertTeam(gameResults?.teams?.home);
    await upsertPlayers(gameResults?.teams?.home);
    await upsertStats(game, gameResults?.teams?.home);

    await upsertTeam(gameResults?.teams?.away);
    await upsertPlayers(gameResults?.teams?.away);
    await upsertStats(game, gameResults?.teams?.away);


}

module.exports = {
    updateGameData
}