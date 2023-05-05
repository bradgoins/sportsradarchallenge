const client = require('../db_client');

const upsertPlayers = async(game, team) => {
    for(let player in team?.players){
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

module.exports = { 
    upsertPlayers
}