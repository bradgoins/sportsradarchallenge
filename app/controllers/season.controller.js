
const scheduleFeed = require('../jobs/monitor_schedule_feed');
const axios = require('axios');

const startFeed = async (req, res) => {
    const results = (await axios.get(`https://statsapi.web.nhl.com/api/v1/seasons?season=${req.params.id}`)).data

    if(results.seasons.length === 1){
        scheduleFeed.process(results.seasons[0]);
        res.status(201)
        res.end()
    }else {
        res.status(403);
        res.send({message: "Season does not exist"});
    }
}

module.exports = {
    startFeed
}