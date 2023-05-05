const client = require('../db_client');

const upsertGame = async(gameData) =>  {
    if((await updateGame(gameData)).rowCount === 0 ){
        await insertGame(gameData);
    }
}

const updateGame = async(gameData) => {
    return await client.query(`UPDATE games SET season=$2, home_team=$3, away_team=$4 WHERE pk=$1`,
        [gameData?.game?.pk, gameData?.game?.season, gameData?.teams?.home?.id, gameData?.teams?.away?.id]);
}

const insertGame = async(gameData) => {
    return await client.query(`INSERT INTO games (pk, season, home_team, away_team) VALUES ($1, $2, $3, $4)`,
        [gameData?.game?.pk, gameData?.game?.season, gameData?.teams?.home?.id, gameData?.teams?.away.id]);
}

module.exports = {
    upsertGame
}