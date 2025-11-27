import API from "../env";
import { get, post, put, del } from "../http";

export async function getAllGames() {
  try {
    const response = await get(API.GAMES.ALL);
    console.log('Games response:', response);
    if (!response.ok) {
      throw new Error('Games petition failed');
    }
    const data = await response.json();
    console.log('Games data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

export async function findGame(id) {
  try {
    const response = await get(API.GAMES.READ(id));
    if (!response.ok) {
      throw new Error(`Game ${id} petition failed`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching game ${id}:`, error);
    throw error;
  }
}

export async function createGame(gameData) {
  try {
    const response = await post(API.GAMES.CREATE, gameData);
    if (!response.ok) {
      throw new Error('Create game failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
}

export async function updateGame(id, gameData) {
  try {
    const response = await put(API.GAMES.UPDATE(id), gameData);
    if (!response.ok) {
      throw new Error(`Update game ${id} failed`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating game ${id}:`, error);
    throw error;
  }
}

export async function deleteGame(id) {
  try {
    const response = await del(API.GAMES.DELETE(id));
    if (!response.ok) {
      throw new Error(`Delete game ${id} failed`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting game ${id}:`, error);
    throw error;
  }
}
