import * as http from '../http.js';
import API from "../env.js";

export async function getUserFavorites() {
    try {
        const response = await http.get(API.USER.FAVORITES);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        return [];
    }
}

export async function addFavorite(gameId) {
    try {
        const response = await http.post(API.USER.ADD_FAVORITE(gameId));
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al añadir favorito:', error);
        return false;
    }
}

export async function removeFavorite(gameId) {
    try {
        const response = await http.del(API.USER.REMOVE_FAVORITE(gameId));
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        return false;
    }
}

export async function checkFavorite(gameId) {
    try {
        const response = await http.get(API.USER.CHECK_FAVORITE(gameId));
        const data = await response.json();
        // HttpResponse devuelve { status: 200, message: boolean }
        return data?.message === true;
    } catch (error) {
        console.error('Error al verificar favorito:', error);
        return false;
    }
}

export async function countFavorites() {
    try {
        const response = await http.get(API.USER.COUNT_FAVORITES);
        const data = await response.json();
        // HttpResponse devuelve { status: 200, message: number }
        return data?.message || 0;
    } catch (error) {
        console.error('Error al contar favoritos:', error);
        return 0;
    }
}

export async function toggleFavorite(gameId) {
    try {
        const isFav = await checkFavorite(gameId);
        if (isFav) {
            return await removeFavorite(gameId);
        } else {
            return await addFavorite(gameId);
        }
    } catch (error) {
        console.error('Error al alternar favorito:', error);
        return false;
    }
}
