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
    WHERE game_pk=$1 AND player_id=$3`, [
        player.person.id,
        player.person.name,
        player.person.number,
        player.person.age
    ])
}

const insertPlayer = async (player) => {
    return await client.query(`INSERT INTO players (player_id, name, number, age) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
            player.person.id,
            player.person.name,
            player.person.number,
            player.person.age
        ])
}

module.exports = { 
    upsertPlayers
}