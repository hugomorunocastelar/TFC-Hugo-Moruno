import API from "../env.js";
import * as http from "../http.js";

export async function fetchGameByCode(uniqueCode) {
  try
  {
    const response = await http.get(API.REFEREE.GET_GAME(uniqueCode));
    if (!response.ok)
    {
      throw new Error('Game petition failed');
    }
    return response.json();
  } catch (error)
  {
    console.error('Fetch game error:', error);
    return false;
  }
}

export async function startGame(uniqueCode) {
  try
  {
    const response = await http.put(API.REFEREE.START_GAME(uniqueCode), {});
    if (!response.ok)
    {
      throw new Error('Start game failed');
    }
    return response.json();
  } catch (error)
  {
    console.error('Start game error:', error);
    return false;
  }
}

export async function finishGame(uniqueCode) {
  try
  {
    const response = await http.put(API.REFEREE.FINISH_GAME(uniqueCode), {});
    if (!response.ok)
    {
      throw new Error('Finish game failed');
    }
    return response.json();
  } catch (error)
  {
    console.error('Finish game error:', error);
    return false;
  }
}

export async function updateSetPoints(uniqueCode, setId, team, points) {
  try
  {
    const response = await http.post(API.REFEREE.UPDATE_POINTS(uniqueCode, setId), {
      team,
      points
    });
    if (!response.ok)
    {
      throw new Error('Update points failed');
    }
    return response.json();
  } catch (error)
  {
    console.error('Update points error:', error);
    return false;
  }
}

export async function addGameSanction(uniqueCode, type, teamId, marcador) {
  try
  {
    const response = await http.post(API.REFEREE.ADD_SANCTION(uniqueCode), {
      type,
      teamId,
      marcador
    });
    if (!response.ok)
    {
      throw new Error('Add sanction failed');
    }
    return response.json();
  } catch (error)
  {
    console.error('Add sanction error:', error);
    return false;
  }
}

export function getSetsArray(gameData) {
  if (!gameData) return [];
  
  if (gameData.sets && Array.isArray(gameData.sets)) {
    return gameData.sets;
  }
  
  const setsArray = [];
  ['set1', 'set2', 'set3', 'set4', 'set5'].forEach((setKey, index) => {
    if (gameData[setKey]) {
      setsArray.push({ 
        ...gameData[setKey], 
        setNumber: index + 1 
      });
    }
  });
  
  return setsArray;
}
