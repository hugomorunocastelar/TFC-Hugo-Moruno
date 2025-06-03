import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Team.css';

function Team() {
  const [teams, setTeams] = useState([]);
  const [persons, setPersons] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    dniCaptainId: '',
    idClubId: '',
    category: '',
  });

  // Fetch teams
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

  // Fetch persons for captain dropdown
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

  // Fetch clubs for club dropdown
  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/clubs'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch clubs');
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchPersons();
    fetchClubs();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      dniCaptainId: '',
      idClubId: '',
      category: '',
    });
    setSelectedTeam(null);
    setFormOpen(true);
  };

  const openFormForEdit = (team) => {
    setFormData({
      id: team.id,
      name: team.name,
      dniCaptainId: team.dniCaptain?.id || '',
      idClubId: team.idClub?.id || '',
      category: team.category || '',
    });
    setSelectedTeam(team);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedTeam(null);
    setFormData({
      id: null,
      name: '',
      dniCaptainId: '',
      idClubId: '',
      category: '',
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
      const url = formData.id ? `/api/teams/${formData.id}` : '/api/teams'; // Replace with your URLs
      const bodyData = {
        name: formData.name,
        dniCaptain: { id: formData.dniCaptainId },
        idClub: { id: formData.idClubId },
        category: formData.category,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save team');
      await fetchTeams();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      const response = await fetch(`/api/teams/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete team');
      await fetchTeams();
      if (selectedTeam && selectedTeam.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  // Example categories - replace with your actual categories or fetch dynamically
  const categories = [
    'U10',
    'U12',
    'U14',
    'U16',
    'U18',
    'Senior',
  ];

  return (
    <div className='Team'>
      <div className='Team-Table'>
        <div className='Team-Table-Header'>
          <h2>Teams</h2>
          <NewButton action={openFormForCreate} text="Team" />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Captain</th>
              <th>Club</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.dniCaptain ? `${team.dniCaptain.name} ${team.dniCaptain.surnames || ''}` : ''}</td>
                <td>{team.idClub ? team.idClub.name : ''}</td>
                <td>{team.category}</td>
                <td>
                  <button onClick={() => openFormForEdit(team)}>Edit</button>
                  <button onClick={() => handleDelete(team.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan="5">No teams found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='Team-Form'>
          <h2>{formData.id ? 'Edit Team' : 'New Team'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name*:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={50}
              />
            </label>
            <label>
              Captain*:
              <select
                name="dniCaptainId"
                value={formData.dniCaptainId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a captain</option>
                {persons.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} {person.surnames || ''}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Club*:
              <select
                name="idClubId"
                value={formData.idClubId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category*:
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <div className='Team-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Team;