const client = require('../db_client');
const axios = require('axios');
const { updateGameData } = require('../helpers/update_game_data');
const { getGameData } = require('../helpers/get_game_data');
const { upsertGame } = require('../helpers/upsert_game');

const process = async (game) => {
    
    let gameData = await getGameData(game)
    upsertGame(gameData)
    let gameStatus = gameData?.status?.detailedState

    if(gameStatus === 'Final') {
        await updateGameData(gameData);
    }else {
        await monitorGame(game, gameData);
    }
}

const monitorGame = async(game, gameData) => {
    
    if(gameData?.status?.detailedState === 'Scheduled') {
        // game is scheduled in the past and doesn't appear to have been played.
        // and probably won't be.
        if(new Date(gameData?.datetime?.dateTime) < new Date()){
            return;
        }
        await pauseUntilDate(gameData);
        gameData = await getGameData(game);
    }

    if(gameData?.status?.detailedState === 'Live') {
        updateGame(game)
    }

}

const updateGame = async(game) =>{
    const intervalId = setInterval(async () => {
        await updateGameData(game);
        const gameData = await getGameData(game);
        if(gameData?.status?.detailedState !== "Live") clearInterval(intervalId);
    }, 1000)
}


const pauseUntilDate = async (gameData) => {
    const delay = Math.abs(new Date(gameData.datetime.dateTime) - new Date());
    if(delay > 0){
        return pauseForMil(delay)
    }
}

const pauseForMil = async(time) => {
    return new Promise(resolve => setTimeout(resolve, time))
}

module.exports = { 
    process
}