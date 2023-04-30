const client = require('../db_client');
const axios = require('axios');

const process = async (game) => {
    
    let gameData = await getGameData(game)
    upsertGame(gameData)
    let gameStatus = gameData.status.detailedState

    if(gameStatus === 'Final') {
        await updateGameData(game);
    }else {
        await monitorGame(game, gameData);
    }
}

const upsertGame = async(gameData) =>  {
    if((await updateGame(gameData)).rowCount === 0 ){
        await insertGame(gameData);
    }
}

const updateGame = async(gameData) => {
    return await client.query(`UPDATE games SET season=$2, home_team=$3, away_team=$4 WHERE pk=$1`,
        [gameData.game.pk, gameData.game.season, gameData.teams.home.id, gameData.teams.away.id]);
}

const insertGame = async(gameData) => {
    return await client.query(`INSERT INTO games (pk, season, home_team, away_team) VALUES ($1, $2, $3, $4)`,
        [gameData.game.pk, gameData.game.season, gameData.teams.home.id, gameData.teams.away.id]);
}

const monitorGame = async(game, gameData) => {
    
    while(gameData.status.detailedState !== 'Final'){

        if(gameData.status.detailedState !== 'Live'){

            // game is scheduled in the past and doesn't appear to have been played.
            // and probably won't be.
            if(new Date(gameData.datetime.dateTime) < new Date()){
                break;
            }
            pauseUntilDate(gameData);
        }

        await updateGameData(game);
        
        gameData = await getGameData(game)
    }
}

const pauseUntilDate = async (gameData) => {
    const delay = new Date(gameData.datetime.dateTime) - new Date();
    if(delay > 0){
        return new Promise(resolve => setTimeout(resolve, Math.abs(new Date(gameData.datetime.dateTime) - new Date())))
    }
}

const getGameData = async(game) => {
    const gameResults = (await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${game.gamePk}/feed/live`)).data;
    return gameResults.gameData
}

const upsertPlayers = async(game, team) => {
    for(let player in team.players){
        //update player game stats
        if((await updatePlayer(game, team, team.players[player])).rowCount === 0) {
            await insertPlayer(game, team, team.players[player]);
        }
    }

    return;
}

const updatePlayer = async (game, team, player) => {

    return await client.query(`UPDATE player_game_stats SET game_pk=$1, team_id=$2, player_id=$3, position=$4, assists=$5, goals=$6, hits=$7, points=$8, penalty_minutes=$9
    WHERE game_pk=$1 AND player_id=$3`, [
        game.gamePk,
        team.team.id,
        player.person.id,
        player.position.name,
        player?.stats?.skaterStats?.assists || 0,
        player?.stats?.skaterStats?.goals || 0,
        player?.stats?.skaterStats?.hits || 0,
        player?.stats?.skaterStats?.assists + player?.stats?.skaterStats?.goals || 0,
        player?.stats?.skaterStats?.penaltyMinutes || 0
    ])
}

const insertPlayer = async (game, team, player) => {
    return await client.query(`INSERT INTO player_game_stats (game_pk, team_id, player_id, position, assists, goals, hits, points, penalty_minutes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
            game.gamePk,
            team.team.id,
            player?.person?.id,
            player?.position?.name,
            player?.stats?.skaterStats?.assists || 0,
            player?.stats?.skaterStats?.goals || 0,
            player?.stats?.skaterStats?.hits || 0,
            player?.stats?.skaterStats?.assists + player?.stats?.skaterStats?.goals || 0,
            player?.stats?.skaterStats?.penaltyMinutes || 0
        ])
}

const updateGameData = async(game) => {
    const gameResults = (await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${game.gamePk}/boxscore`)).data;

    await upsertPlayers(game, gameResults.teams.home);
    await upsertPlayers(game, gameResults.teams.away);
}

module.exports = { process }