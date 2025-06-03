import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Coach.css';

function Coach() {
  const [coaches, setCoaches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    noLicense: '',
    lvlLicense: '',
    teamId: '',
    personId: '',
  });

  // Fetch coaches
  const fetchCoaches = async () => {
    try {
      const response = await fetch('/api/coaches'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch coaches');
      const data = await response.json();
      setCoaches(data);
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
    fetchCoaches();
    fetchTeams();
    fetchPersons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      noLicense: '',
      lvlLicense: '',
      teamId: '',
      personId: '',
    });
    setSelectedCoach(null);
    setFormOpen(true);
  };

  const openFormForEdit = (coach) => {
    setFormData({
      id: coach.id,
      noLicense: coach.noLicense,
      lvlLicense: coach.lvlLicense,
      teamId: coach.team ? coach.team.id : '',
      personId: coach.dni ? coach.dni.id : '',
    });
    setSelectedCoach(coach);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedCoach(null);
    setFormData({
      id: null,
      noLicense: '',
      lvlLicense: '',
      teamId: '',
      personId: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/coaches/${formData.id}` : '/api/coaches'; // Replace with your URLs
      const bodyData = {
        noLicense: formData.noLicense,
        lvlLicense: formData.lvlLicense,
        team: formData.teamId ? { id: formData.teamId } : null,
        dni: formData.personId ? { id: formData.personId } : null,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save coach');
      await fetchCoaches();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return;
    try {
      const response = await fetch(`/api/coaches/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete coach');
      await fetchCoaches();
      if (selectedCoach && selectedCoach.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Coach'>
      <div className='Coach-Table'>
        <div className='Coach-Table-Header'>
          <h2>Coaches</h2>
          <NewButton action={openFormForCreate} text="Coach" />
        </div>
        <table>
          <thead>
            <tr>
              <th>No License</th>
              <th>Level License</th>
              <th>Team</th>
              <th>Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map(coach => (
              <tr key={coach.id}>
                <td>{coach.noLicense}</td>
                <td>{coach.lvlLicense}</td>
                <td>{coach.team ? coach.team.name : ''}</td>
                <td>{coach.dni ? `${coach.dni.name} ${coach.dni.surnames || ''}` : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(coach)}>Edit</button>
                  <button onClick={() => handleDelete(coach.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {coaches.length === 0 && (
              <tr>
                <td colSpan="5">No coaches found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='Coach-Form'>
          <h2>{formData.id ? 'Edit Coach' : 'New Coach'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              No License*:
              <input
                type="text"
                name="noLicense"
                value={formData.noLicense}
                onChange={handleInputChange}
                required
                maxLength={20}
              />
            </label>
            <label>
              Level License*:
              <input
                type="text"
                name="lvlLicense"
                value={formData.lvlLicense}
                onChange={handleInputChange}
                required
                maxLength={3}
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
            <div className='Coach-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Coach;