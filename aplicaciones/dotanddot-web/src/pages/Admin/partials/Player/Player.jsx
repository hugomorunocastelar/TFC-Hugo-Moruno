import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Player.css';

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

  // Fetch players
  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch teams for dropdown
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch persons for dropdown
  const fetchPersons = async () => {
    try {
      const response = await fetch('/api/persons'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch persons');
      const data = await response.json();
      setPersons(data);
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
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/players/${formData.id}` : '/api/players'; // Replace with your URLs
      const bodyData = {
        noShirt: formData.noShirt,
        team: formData.teamId ? { id: formData.teamId } : null,
        dni: formData.personId ? { id: formData.personId } : null,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save player');
      await fetchPlayers();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    try {
      const response = await fetch(`/api/players/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete player');
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
          <NewButton action={openFormForCreate} text="Player" />
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
            {players.map(player => (
              <tr key={player.id}>
                <td>{player.noShirt}</td>
                <td>{player.team ? player.team.name : ''}</td>
                <td>{player.dni ? `${player.dni.name} ${player.dni.surnames || ''}` : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(player)}>Edit</button>
                  <button onClick={() => handleDelete(player.id)}>Delete</button>
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
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Player;