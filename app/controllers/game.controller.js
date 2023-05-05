const client = require('../db_client');

const getGameStats = async (req, res) => {

    const results = await client.query(`SELECT player_game_stats.*, 
        players.name AS player_name, 
        players.age,
        players.number,
        teams.team_name,
        home_team.team_name as home_team_name,
        away_team.team_name as away_team_name
        FROM player_game_stats 
        LEFT JOIN teams ON player_game_stats.team_id = teams.team_id
        LEFT JOIN players ON player_game_stats.player_id = players.player_id
        LEFT JOIN games ON games.pk = player_game_stats.game_pk
        LEFT JOIN teams home_team ON games.home_team = teams.team_id
        LEFT JOIN teams away_team ON games.away_team = teams.team_id
        WHERE game_pk=$1`, [req.params.id])

    if(results.rows.length > 0){
        res.send(results.rows.map((row) => {
            return {
                playerId: row.player_id,
                playerName: row.player_name,
                teamId: row.team_id,
                teamName: row.team_name,
                playerAge: row.age,
                playerNumber: row.player_number,
                playerPosition: row.position,
                assits: row.assists,
                goals: row.goals,
                hits: row.hits,
                points: row.points,
                penaltyMinutes: row.penalty_minutes,
                opponnetTeam: row.team_name == row.home_team_name ? row.away_team_name : row.home_team_name
            }
        }));
    }else {
        res.status(404);
        res.send({message: "Game cannot be found or has not been played"});
    }
}

module.exports = {
    getGameStats
}