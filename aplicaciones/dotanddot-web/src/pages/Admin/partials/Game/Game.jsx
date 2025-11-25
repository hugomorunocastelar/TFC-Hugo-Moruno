import React, { useEffect, useState } from 'react';
import { getAllTeams } from '../../../../js/cruds/teams.mjs';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import Paginator from '../../../../components/Paginator/Paginator';
import API from '../../../../js/env';

function Game() {
    const [games, setGames] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        localId: '',
        visitantId: '',
        leagueId: '',
        gameDate: '',
        gameTime: '',
        gameplaceId: '',
        status: 'pending',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(games.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentGames = games.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const fetchGames = async () => {
        try {
            // Placeholder for API call to fetch games
            setGames([]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTeams = async () => {
        try {
            const data = await getAllTeams();
            setTeams(data || []);
        } catch (error) {
            setTeams([]);
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGames();
        fetchTeams();
    }, []);

    function openFormForCreate() {
        setFormData({
            id: null,
            localId: '',
            visitantId: '',
            leagueId: '',
            gameDate: '',
            gameTime: '',
            gameplaceId: '',
            status: 'pending',
        });
        setSelectedGame(null);
        setFormOpen(true);
    };

    const openFormForEdit = (game) => {
        setFormData({
            id: game.id,
            localId: game.localId || '',
            visitantId: game.visitantId || '',
            leagueId: game.leagueId || '',
            gameDate: game.gameDate || '',
            gameTime: game.gameTime || '',
            gameplaceId: game.gameplaceId || '',
            status: game.status || 'pending',
        });
        setSelectedGame(game);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setSelectedGame(null);
        setFormData({
            id: null,
            localId: '',
            visitantId: '',
            leagueId: '',
            gameDate: '',
            gameTime: '',
            gameplaceId: '',
            status: 'pending',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bodyData = {
                localId: formData.localId,
                visitantId: formData.visitantId,
                leagueId: formData.leagueId,
                gameDate: formData.gameDate,
                gameTime: formData.gameTime,
                gameplaceId: formData.gameplaceId,
                status: formData.status,
            };

            if (formData.id) {
                await put(API.GAMES.UPDATE(formData.id), bodyData);
            } else {
                await post(API.GAMES.CREATE, bodyData);
            }
            await fetchGames();
            closeForm();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this game?')) return;
        try {
            await del(API.GAMES.DELETE(id));
            await fetchGames();
            if (selectedGame && selectedGame.id === id) closeForm();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='container'>
        {!formOpen && (
            <div className='data-table'>
                <div className='table-header'>
                    <h2>Games</h2>
                    <button onClick={openFormForCreate}><NewButton /></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Local</th>
                            <th>Visitant</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentGames.map(game => (
                            <tr key={game.id}>
                                <td>{game.localId}</td>
                                <td>{game.visitantId}</td>
                                <td>{game.gameDate}</td>
                                <td>{game.gameTime}</td>
                                <td>{game.status}</td>
                                <td>
                                    <button onClick={() => openFormForEdit(game)}><EditButton /></button>
                                    <button onClick={() => handleDelete(game.id)}><DeleteButton /></button>
                                </td>
                            </tr>
                        ))}
                        {games.length === 0 && (
                            <tr>
                                <td colSpan="6">No games found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            </div>
        )}

        {formOpen && (
            <div className='data-form'>
                <h2>{formData.id ? 'Edit Game' : 'New Game'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Local*:
                        <select
                            name="localId"
                            value={formData.localId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select local team</option>
                            {teams.filter(team => team.id !== formData.visitantId).map(team => (
                                <option key={team.id} value={team.id}>{team.name || team.id}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Visitant*:
                        <select
                            name="visitantId"
                            value={formData.visitantId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select visitant team</option>
                            {teams.filter(team => team.id !== formData.localId).map(team => (
                                <option key={team.id} value={team.id}>{team.name || team.id}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        League ID:
                        <input
                            type="text"
                            name="leagueId"
                            value={formData.leagueId}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Game Date*:
                        <input
                            type="date"
                            name="gameDate"
                            value={formData.gameDate}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Game Time:
                        <input
                            type="time"
                            name="gameTime"
                            value={formData.gameTime}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Gameplace ID:
                        <input
                            type="text"
                            name="gameplaceId"
                            value={formData.gameplaceId}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Status:
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="played">Played</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </label>
                    <div className='data-form-buttons'>
                        {formData.id ? <UpdateButton type="submit" /> : <CreateButton type="submit" />}
                        <button type="button" onClick={closeForm}><CancelButton /></button>
                    </div>
                </form>
            </div>
        )}
        </div>
    );
}

export default Game;