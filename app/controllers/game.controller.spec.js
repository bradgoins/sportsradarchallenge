const client = require('../db_client');
const app = require("../server");
const supertest = require("supertest");
const gameDataQuery = require("../__mocks__/pg/game_data_query.json");

jest.mock('../db_client', () => {
	return {
        connect: jest.fn(),
		query: jest.fn(() => { 
            return { rows: [], rowCount: 0 }
        })
	}
})

describe('games', () => {
    
    describe('/games:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })

        test('/games/:id returns data', async () => {
            client.query.mockReturnValue({rows: gameDataQuery});
            const response = await supertest(app).get("/games/2021010002").expect(200)
            expect(response.body).toEqual(gameDataQuery.map((row) => {
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
            }))
        })

        // test('uses query parameter', async() => {
        //     jest.spyOn(client, 'query')
        //     await supertest(app).get("/games/2021010002")
            
        //     expect(client.query.mock.calls).toEqual([`SELECT player_game_stats.*,·
        //     players.name AS player_name,·
        //     players.age,
        //     players.number,
        //     teams.team_name,
        //     home_team.team_name as home_team_name,
        //     away_team.team_name as away_team_name
        //     FROM player_game_stats·
        //     LEFT JOIN teams ON player_game_stats.team_id = teams.team_id
        //     LEFT JOIN players ON player_game_stats.player_id = players.player_id
        //     LEFT JOIN games ON games.pk = player_game_stats.game_pk
        //     LEFT JOIN teams home_team ON games.home_team = teams.team_id
        //     LEFT JOIN teams away_team ON games.away_team = teams.team_id
        //     WHERE game_pk=2021010002`])
        // })

        test('return error if no data', async () => {
            client.query.mockReturnValue({ rows: [], rowCount: 0 });
            const response = await supertest(app).get("/games/2021010002").expect(404)
            expect(response.body).toEqual({message: "Game cannot be found or has not been played"})
        })
    })
})
