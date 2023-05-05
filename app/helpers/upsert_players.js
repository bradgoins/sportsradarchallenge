const client = require('../db_client');

const upsertPlayers = async(team) => {
    for(let player in team?.players){
        //update player game stats
        if((await updatePlayer(team.players[player])).rowCount === 0) {
            await insertPlayer(team.players[player]);
        }
    }

    return;
}

const updatePlayer = async (player) => {
    return await client.query(`UPDATE players SET name=$2, number=$3, age=$4
    WHERE player_id=$1`, [
        player.person.id,
        player.person.fullName,
        player.jerseyNumber,
        player.person.currentAge
    ])
}

const insertPlayer = async (player) => {
    return await client.query(`INSERT INTO players (player_id, name, number, age) 
        VALUES ($1, $2, $3, $4)`, [
            player.person.id,
            player.person.fullName,
            player.jerseyNumber,
            player.person.currentAge
        ])
}

module.exports = { 
    upsertPlayers
}