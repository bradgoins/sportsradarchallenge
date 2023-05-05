const gameFeed = require('./monitor_game_feed');
const gameData = require('../__mocks__/axios/data/game.json');
const liveFeedData = require('../__mocks__/axios/data/live_feed.json');
const boxscoreData = require('../__mocks__/axios/data/boxscore.json');
const UpsertPlayers = require('../helpers/upsert_players');
// const UpdateGameData = require('../helpers/update_game_data');
const GetGameData = require('../helpers/get_game_data');
const GetBoxscores = require('../helpers/get_boxscores');
const client = require('../db_client');
const axios = require('axios');

jest.mock('../db_client', () => {
	return {
		query: jest.fn(() => {
			return { rows: [], rowCount: 0 }
		})
	}
});
jest.mock('axios');

jest.mock('../helpers/upsert_players', () => {
	return {
		upsertPlayers: jest.fn()
	}
})

const tempGameData = {...liveFeedData.gameData }
jest.mock('../helpers/get_game_data', () => {
	return {
		getGameData: jest.fn()
	}
})
jest.mock('../helpers/get_boxscores', () => {
	return {
		getBoxscore: jest.fn()
	}
})

describe('game feed', () => {

	beforeEach(() => {
		jest.useRealTimers()

		axios.get = jest.fn()
			.mockReturnValue({data: liveFeedData})
			.mockReturnValueOnce({data: boxscoreData})

		GetGameData.getGameData.mockReturnValue(liveFeedData.gameData);
		GetBoxscores.getBoxscore.mockReturnValue(boxscoreData)

	})

	describe('process', () => {

		describe('game day', () => {
			
			beforeEach(() => {
				jest.clearAllMocks();
				const date = new Date('2021-09-30').setUTCHours(0)

        jest
          .useFakeTimers()
          .setSystemTime(date);
				
			})

			afterEach(() => {
				jest.useRealTimers();
				
			});

			describe('a couple hours to game time', () => {

				test('waiting to run updates', async () => {
					jest.spyOn(UpsertPlayers, 'upsertPlayers')
	
					gameFeed.process({...gameData});
					
					const intervalLength = 1000;
					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(0) // no updates

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(0) // no updates

					// Game is going Live
					GetGameData.getGameData.mockReturnValue({
						...liveFeedData.gameData,
						status: {
							detailedState: 'Live'
						}
					});

					await jest.advanceTimersByTimeAsync(2*60*60*1000) // move forward 2 hrs
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(4) // updates home and away

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(6) // updates home and away

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(8) // updates home and away

					// Games is over
					GetGameData.getGameData.mockReturnValue({
						...liveFeedData.gameData,
						status: {
							detailedState: 'Final'
						}
					})

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(10)  // updates home and away

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(10) // no updates
				})
			})

			describe('game is already live', () => {
				
				test('starts updating right away', async () => {
					jest.spyOn(UpsertPlayers, 'upsertPlayers')
					GetGameData.getGameData.mockReturnValue({
						...liveFeedData.gameData,
						status: {
							detailedState: 'Live'
						}
					});
	
					gameFeed.process({...gameData});
					
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(0) // no updates

					const intervalLength = 1000;
					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(2) // updates home and away

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(4) // updates home and away

					// Games is over
					GetGameData.getGameData.mockReturnValue({
						...liveFeedData.gameData,
						status: {
							detailedState: 'Final'
						}
					})

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(6)  // updates home and away

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(6) // no updates

				})
			})

			describe('game has passed', () => {

				test('starts updating right away', async () => {
					jest.spyOn(UpsertPlayers, 'upsertPlayers')
					GetGameData.getGameData.mockReturnValue({
						...liveFeedData.gameData,
						status: {
							detailedState: 'Final'
						}
					});
	
					gameFeed.process({...gameData});

					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(0) // no updates

					const intervalLength = 1000;
					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(2) // updates home and away

					await jest.advanceTimersByTimeAsync(intervalLength) // move forward 1 interval
					expect(UpsertPlayers.upsertPlayers).toHaveBeenCalledTimes(2) // updates home and away

				})
			})
		})
	});
})