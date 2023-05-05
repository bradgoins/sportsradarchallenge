const client = require('../db_client');

const upsertTeam = async(gameData) =>  {
    if((await updateTeam(gameData)).rowCount === 0 ){
        await insertTeam(gameData);
    }
}

const updateTeam = async(gameData) => {
    return await client.query(`UPDATE teams SET team_name=$2 WHERE team_id=$1`,
        [gameData?.team?.id, gameData?.team?.name]);
}

const insertTeam = async(gameData) => {
    return await client.query(`INSERT INTO teams (team_id, team_name) VALUES ($1, $2)`,
        [gameData?.team?.id, gameData?.team?.name]);
}

module.exports = {
    upsertTeam
}