import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import './Player.css';
import { getAllTeams } from '../../../../js/cruds/teams.mjs';
import API from '../../../../js/env';
import { getAllPlayers } from '../../../../js/cruds/players.mjs';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';

function Player() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    noShirt: '',
    teamId: '',
    personId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlayers = players.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Fetch players
  const fetchPlayers = async () => {
    try {
      getAllPlayers()
      .then((response) => {
        if (response) 
          setPlayers(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch teams for dropdown
  const fetchTeams = async () => {
    try {
      getAllTeams()
      .then((response) => {
        if (response) 
          setTeams(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch persons for dropdown
  const fetchPersons = async () => {
    try {
      getAllPersons()
      .then((response) => {
        if (response) 
          setPersons(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
    fetchPersons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      noShirt: '',
      teamId: '',
      personId: '',
    });
    setSelectedPlayer(null);
    setFormOpen(true);
  };

  const openFormForEdit = (player) => {
    setFormData({
      id: player.id,
      noShirt: player.noShirt,
      teamId: player.team ? player.team.id : '',
      personId: player.dni ? player.dni.id : '',
    });
    setSelectedPlayer(player);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedPlayer(null);
    setFormData({
      id: null,
      noShirt: '',
      teamId: '',
      personId: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = {
        noShirt: formData.noShirt,
        team: formData.teamId ? { id: formData.teamId } : null,
        dni: formData.personId ? { id: formData.personId } : null,
      };

      if (formData.id) {
        await put(API.PLAYER.UPDATE(formData.id), bodyData);
      } else {
        await post(API.PLAYER.CREATE, bodyData);
      }
      await fetchPlayers();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    try {
      await del(API.PLAYER.DELETE(id));
      await fetchPlayers();
      if (selectedPlayer && selectedPlayer.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Player'>
      <div className='Player-Table'>
        <div className='Player-Table-Header'>
          <h2>Players</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>No Shirt</th>
              <th>Team</th>
              <th>Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers.map(player => (
              <tr key={player.id}>
                <td>{player.noShirt}</td>
                <td>{player.team ? player.team.name : ''}</td>
                <td>{player.dni ? `${player.dni.name} ${player.dni.surnames || ''}` : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(player)}><EditButton /></button>
                  <button onClick={() => handleDelete(player.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan="4">No players found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>

      {formOpen && (
        <div className='Player-Form'>
          <h2>{formData.id ? 'Edit Player' : 'New Player'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              No Shirt*:
              <input
                type="number"
                name="noShirt"
                value={formData.noShirt}
                onChange={handleInputChange}
                required
                min={0}
              />
            </label>
            <label>
              Team:
              <select
                name="teamId"
                value={formData.teamId}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Person:
              <select
                name="personId"
                value={formData.personId}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {persons.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} {person.surnames || ''}
                  </option>
                ))}
              </select>
            </label>
            <div className='Player-Form-Actions'>
              <button type="submit">{formData.id ? <UpdateButton /> : <CreateButton />}</button>
              <button type="button" onClick={closeForm}><CancelButton /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Player;