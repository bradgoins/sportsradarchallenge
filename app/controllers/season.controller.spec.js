const app = require("../server");
const axios = require('axios');
const supertest = require("supertest");
const previousSeason = require("../__mocks__/axios/data/previous_season.json");
const scheduleFeed = require('../jobs/monitor_schedule_feed');

jest.mock('axios')
jest.mock('../jobs/monitor_schedule_feed')
describe('games', () => {
    
    describe('/games:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })

        test('/seasons/:id starts feed', async () => {
            jest.spyOn(scheduleFeed, 'process')
            axios.get.mockReturnValue({data: previousSeason});
            const response = await supertest(app).post("/seasons/20212022").expect(201)
            expect(response.body).toEqual({})
            expect(scheduleFeed.process).toHaveBeenCalledWith(previousSeason.seasons[0])
        })

        test('return error if no data', async () => {
            axios.get.mockReturnValue({data: { seasons:[] } });
            const response = await supertest(app).post("/seasons/20212022").expect(403)
            expect(response.body).toEqual({message: "Season does not exist"})
        })
    })
})
