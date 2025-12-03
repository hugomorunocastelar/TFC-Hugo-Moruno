import API from "../env.js";
import * as http from "../http.js";
import { getSession } from "../session.mjs";

export async function getRefereeGames() {
  try
  {
    const session = getSession();
    if (!session) {
      throw new Error("No active session found");
    }

    const refereeId = session.refereeId || session.referee?.id || session.id;
    
    if (!refereeId) {
      console.error("Current session:", session);
      throw new Error("Referee ID not found in session. Please verify the user has referee role.");
    }

    const response = await http.get(API.REFEREE.GAMES(refereeId));
    
    if (!response.ok) {
      throw new Error("Error fetching referee games");
    }
    
    const data = await response.json();
    return data.data || data || [];
  } catch (error)
  {
    console.error("Error getting referee games:", error);
    throw error;
  }
}
