import React, { useEffect, useRef, useState } from 'react';
import { getAllTeams } from '../../../../js/cruds/teams.mjs';
import { getAllLeagues } from '../../../../js/cruds/leagues.mjs';
import { getAllCompetitions } from '../../../../js/cruds/competition.mjs';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import { getAllReferees } from '../../../../js/cruds/referees.mjs';
import { getAllGames, createGame, updateGame, deleteGame } from '../../../../js/cruds/games.mjs';
import Loader from '../../../Loader/Loader.jsx';
import GameTable from './partials/GameTable.jsx';
import GameForm from './partials/GameForm.jsx';
import '../shared-styles.css';
import './partials/GameForm.css';
import './partials/GameTable.css';

function Game() {
    const [games, setGames] = useState([]);
    const [teams, setTeams] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [cities, setCities] = useState([]);
    const [referees, setReferees] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        relevance: 0,
        leagueId: '',
        category: '',
        division: '',
        competitionId: '',
        cityId: '',
        date: '',
        localTeamId: '',
        visitTeamId: '',
        principalRefereeId: '',
        secondaryRefereeId: '',
        scorerId: '',
        lineReferee1Id: '',
        lineReferee2Id: '',
        lineReferee3Id: '',
        lineReferee4Id: '',
        observations: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loadingData, setLoadingData] = useState(true);
    const fetchedRef = useRef(false);

    const totalPages = Math.ceil(games.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentGames = games.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const fetchGames = async (force = false) => {
        try {
            if (fetchedRef.current && !force) return;
            fetchedRef.current = true;
            setLoadingData(true);
            const data = await getAllGames();
            setGames(data || []);
            setLoadingData(false);
        } catch (error) {
            console.error('Error fetching games:', error);
            setGames([]);
            setLoadingData(false);
        }
    };

    const fetchAllData = async () => {
        try {
            const [teamsData, leaguesData, competitionsData, citiesData, refereesData] = await Promise.all([
                getAllTeams(),
                getAllLeagues(),
                getAllCompetitions(),
                getAllCities(),
                getAllReferees(),
            ]);
            setTeams(teamsData || []);
            setLeagues(leaguesData || []);
            setCompetitions(competitionsData || []);
            setCities(citiesData || []);
            setReferees(refereesData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchGames();
        fetchAllData();
    }, []);

    function openFormForCreate() {
        setFormData({
            id: null,
            relevance: 0,
            leagueId: '',
            category: '',
            division: '',
            competitionId: '',
            cityId: '',
            date: '',
            localTeamId: '',
            visitTeamId: '',
            principalRefereeId: '',
            secondaryRefereeId: '',
            scorerId: '',
            lineReferee1Id: '',
            lineReferee2Id: '',
            lineReferee3Id: '',
            lineReferee4Id: '',
            observations: '',
        });
        setSelectedGame(null);
        setFormOpen(true);
    }

    const openFormForEdit = (game) => {
        setFormData({
            id: game.id,
            relevance: game.relevance || 0,
            leagueId: game.league?.id || '',
            category: game.details?.category || '',
            division: game.details?.division || '',
            competitionId: game.details?.competition?.id || '',
            cityId: game.details?.city?.id || '',
            date: game.details?.date ? new Date(game.details.date).toISOString().split('T')[0] : '',
            localTeamId: game.initialSituation?.localTeam?.id || '',
            visitTeamId: game.initialSituation?.visitTeam?.id || '',
            principalRefereeId: game.refereeTeam?.principalReferee?.id || '',
            secondaryRefereeId: game.refereeTeam?.secondaryReferee?.id || '',
            scorerId: game.refereeTeam?.scorer?.id || '',
            lineReferee1Id: game.refereeTeam?.lineReferee1?.id || '',
            lineReferee2Id: game.refereeTeam?.lineReferee2?.id || '',
            lineReferee3Id: game.refereeTeam?.lineReferee3?.id || '',
            lineReferee4Id: game.refereeTeam?.lineReferee4?.id || '',
            observations: game.observation?.observations || '',
        });
        setSelectedGame(game);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setSelectedGame(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bodyData = {
                relevance: parseInt(formData.relevance) || 0,
                leagueId: formData.leagueId && formData.leagueId !== '' ? parseInt(formData.leagueId) : null,
                category: formData.category && formData.category !== '' ? formData.category : null,
                division: formData.division && formData.division !== '' ? formData.division : null,
                competitionId: formData.competitionId && formData.competitionId !== '' ? parseInt(formData.competitionId) : null,
                cityId: formData.cityId && formData.cityId !== '' ? parseInt(formData.cityId) : null,
                date: formData.date && formData.date !== '' ? new Date(formData.date).toISOString() : null,
                localTeamId: formData.localTeamId && formData.localTeamId !== '' ? parseInt(formData.localTeamId) : null,
                visitTeamId: formData.visitTeamId && formData.visitTeamId !== '' ? parseInt(formData.visitTeamId) : null,
                principalRefereeId: formData.principalRefereeId && formData.principalRefereeId !== '' ? parseInt(formData.principalRefereeId) : null,
                secondaryRefereeId: formData.secondaryRefereeId && formData.secondaryRefereeId !== '' ? parseInt(formData.secondaryRefereeId) : null,
                scorerId: formData.scorerId && formData.scorerId !== '' ? parseInt(formData.scorerId) : null,
                lineReferee1Id: formData.lineReferee1Id && formData.lineReferee1Id !== '' ? parseInt(formData.lineReferee1Id) : null,
                lineReferee2Id: formData.lineReferee2Id && formData.lineReferee2Id !== '' ? parseInt(formData.lineReferee2Id) : null,
                lineReferee3Id: formData.lineReferee3Id && formData.lineReferee3Id !== '' ? parseInt(formData.lineReferee3Id) : null,
                lineReferee4Id: formData.lineReferee4Id && formData.lineReferee4Id !== '' ? parseInt(formData.lineReferee4Id) : null,
                observations: formData.observations && formData.observations !== '' ? formData.observations : null,
            };

            console.log('Sending game data:', bodyData);

            if (formData.id) {
                await updateGame(formData.id, bodyData);
            } else {
                await createGame(bodyData);
            }
            await fetchGames(true);
            closeForm();
        } catch (error) {
            console.error('Error saving game:', error);
            let errorMessage = 'Error saving the game.';
            
            if (error.response) {
                errorMessage += ` ${error.response.data?.message || error.response.statusText || ''}`;
            } else if (error.message) {
                errorMessage += ` ${error.message}`;
            }
            
            errorMessage += '\n\nVerify that all required fields are complete:\n- League\n- Relevance\n- Category\n- Competition\n- City\n- Date\n- Local Team\n- Visiting Team\n- Principal Referee';
            
            alert(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this game?')) return;
        try {
            await deleteGame(id);
            await fetchGames(true);
            if (selectedGame && selectedGame.id === id) closeForm();
        } catch (error) {
            console.error('Error deleting game:', error);
            alert('Error deleting the game.');
        }
    };

    return (
        <div className='admin-container'>
            {loadingData ? (
                <Loader />
            ) : formOpen ? (
                <GameForm
                    formData={formData}
                    teams={teams}
                    leagues={leagues}
                    competitions={competitions}
                    cities={cities}
                    referees={referees}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={closeForm}
                />
            ) : (
                <GameTable
                    currentGames={currentGames}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    onNew={openFormForCreate}
                    onEdit={openFormForEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}

export default Game;