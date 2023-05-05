const axios = require('axios');
const gameFeed = require('./monitor_game_feed');

const getCurrentSeason = async(current = false) => {
    return (await axios.get('https://statsapi.web.nhl.com/api/v1/seasons/current')).data.seasons[0];
}

const getSeasonDates = async(season) => {
    return (await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?season=${season.seasonId}`)).data.dates;
}

const checkGames = async (games) => {
    
    const promises = [];
    games.forEach( (game) => {
        promises.push(gameFeed.process(game));
    })

    await Promise.all(promises);
}

const monitorSeasonFeed = async (season) => {
    const today = new Date();
    today.setUTCHours(0);

    const seasonDates = await getSeasonDates(season);

    for(let i = 0; i < seasonDates.length; i++){
        const gameDay = new Date(seasonDates[i].date);
        if(gameDay <= today){
            await checkGames(seasonDates[i].games)
        }else {
            await pauseUntilDate(gameDay, today);
            await checkGames(seasonDates[i].games)
        }
    }
}

const pauseUntilDate = async (gameDay, today) => {
    return new Promise(resolve => {
        setTimeout(resolve, Math.abs(gameDay - new Date()))
    })
}
const process = async (season) => {

    if(!season){
        season = await getCurrentSeason();
    }
    
    return await monitorSeasonFeed(season);
}

module.exports = { 
    process
}