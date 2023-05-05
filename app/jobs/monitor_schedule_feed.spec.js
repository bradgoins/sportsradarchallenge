const scheduleFeed = require('./monitor_schedule_feed');
const currentSeasonData = require('../__mocks__/axios/data/current_season.json');
const currentSeasonSchedule = require('../__mocks__/axios/data/current_season_schedule.json');
const previousSeasonData = require('../__mocks__/axios/data/previous_season.json');
const previousSeasonSchedule = require('../__mocks__/axios/data/previous_season_schedule.json');
const gameFeed = require('./monitor_game_feed');

const axios = require('axios');
jest.mock('axios')

describe('schedule feed', () => {

  describe('process', () => {

    beforeEach(() => {
      gameFeed.process = jest.fn(async () => {});
    })

    afterEach(() => {
      jest.useRealTimers();
    });
    
    describe('currrent season', () => {
      beforeEach(() => {
        axios.get = jest.fn()
          .mockReturnValueOnce({data: currentSeasonData})
          .mockReturnValueOnce({data: currentSeasonSchedule});
      })

      test('uses current season by default', async () => {
        jest.spyOn(axios, 'get');
        
        await scheduleFeed.process();
        expect(axios.get).toHaveBeenCalledTimes(2);
        expect(axios.get).toHaveBeenCalledWith('https://statsapi.web.nhl.com/api/v1/seasons/current');
        expect(axios.get).toHaveBeenCalledWith(`https://statsapi.web.nhl.com/api/v1/schedule?season=${currentSeasonData.seasons[0].seasonId}`);
      });
  
      test('pushes games into games queue', async () => {
        jest.spyOn(gameFeed, 'process');
  
        await scheduleFeed.process();
        expect(gameFeed.process).toHaveBeenCalledTimes(17);
      })
    })

    describe('provided season', () => {
      beforeEach(() => {
        axios.get = jest.fn()
          .mockReturnValueOnce({data: previousSeasonSchedule});
      })

      test('uses season provided', async () => {
        jest.spyOn(axios, 'get');
        
        await scheduleFeed.process(previousSeasonData.seasons[0]);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`https://statsapi.web.nhl.com/api/v1/schedule?season=${previousSeasonData.seasons[0].seasonId}`);
      });
  
      test('pushes games into games queue', async () => {
        jest.spyOn(gameFeed, 'process');
  
        await scheduleFeed.process(previousSeasonData.seasons[0]);
        expect(gameFeed.process).toHaveBeenCalledTimes(31);
        expect(gameFeed.process).toHaveBeenCalledWith(previousSeasonSchedule.dates[0].games[0]); // check first
        expect(gameFeed.process).toHaveBeenCalledWith(previousSeasonSchedule.dates.slice(-1)[0].games.slice(-1)[0]); // check last
      })


      test('delay for future games', async() => {
        const date = new Date(
          new Date('2021-09-26').getTime() + (2*60*60*1000)
        )

        jest
          .useFakeTimers()
          .setSystemTime(date);

        jest.spyOn(global, 'setTimeout');

        scheduleFeed.process(previousSeasonData.seasons[0]);

        await jest.advanceTimersByTimeAsync(1000) // still the 26th
        expect(gameFeed.process).toHaveBeenCalledTimes(11);

        await jest.advanceTimersByTimeAsync(24*60*60*1000); // 27th
        expect(gameFeed.process).toHaveBeenCalledTimes(16);

        await jest.advanceTimersByTimeAsync(24*60*60*1000); // 28th
        expect(gameFeed.process).toHaveBeenCalledTimes(23);

        await jest.advanceTimersByTimeAsync(24*60*60*1000); // 29th
        expect(gameFeed.process).toHaveBeenCalledTimes(31);
      })
    })


  });


})