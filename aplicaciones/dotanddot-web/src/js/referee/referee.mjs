import API from "../env";
import * as http from "../http";
import { getSession } from "../session.mjs";

export async function getRefereeGames() {
  const session = getSession();
  if (!session || !session.refereeId) {
    throw new Error("No se encontró el ID del árbitro en la sesión");
  }

  const response = await http.get(API.REFEREE.GAMES(session.refereeId));
  return response.data || [];
}
