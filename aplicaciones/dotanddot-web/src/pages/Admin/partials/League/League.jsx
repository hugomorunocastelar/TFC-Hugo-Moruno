import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './League.css';

function League() {
  const [leagues, setLeagues] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    competitionId: '',
    codePrefix: '',
  });

  // Fetch leagues
  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch leagues');
      const data = await response.json();
      setLeagues(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch competitions for dropdown
  const fetchCompetitions = async () => {
    try {
      const response = await fetch('/api/competitions'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch competitions');
      const data = await response.json();
      setCompetitions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeagues();
    fetchCompetitions();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      category: '',
      competitionId: '',
      codePrefix: '',
    });
    setSelectedLeague(null);
    setFormOpen(true);
  };

  const openFormForEdit = (league) => {
    setFormData({
      id: league.id,
      name: league.name,
      category: league.category || '',
      competitionId: league.competition ? league.competition.id : '',
      codePrefix: league.codePrefix,
    });
    setSelectedLeague(league);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedLeague(null);
    setFormData({
      id: null,
      name: '',
      category: '',
      competitionId: '',
      codePrefix: '',
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
      const url = formData.id ? `/api/leagues/${formData.id}` : '/api/leagues'; // Replace with your URLs
      const bodyData = {
        name: formData.name,
        category: formData.category,
        competition: formData.competitionId ? { id: formData.competitionId } : null,
        codePrefix: formData.codePrefix,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save league');
      await fetchLeagues();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this league?')) return;
    try {
      const response = await fetch(`/api/leagues/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete league');
      await fetchLeagues();
      if (selectedLeague && selectedLeague.id === id) closeForm();
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
    <div className='League'>
      <div className='League-Table'>
        <div className='League-Table-Header'>
          <h2>Leagues</h2>
          <NewButton action={openFormForCreate} text="League" />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Competition</th>
              <th>Code Prefix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leagues.map(league => (
              <tr key={league.id}>
                <td>{league.name}</td>
                <td>{league.category}</td>
                <td>{league.competition ? league.competition.name : ''}</td>
                <td>{league.codePrefix}</td>
                <td>
                  <button onClick={() => openFormForEdit(league)}>Edit</button>
                  <button onClick={() => handleDelete(league.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {leagues.length === 0 && (
              <tr>
                <td colSpan="5">No leagues found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='League-Form'>
          <h2>{formData.id ? 'Edit League' : 'New League'}</h2>
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
            <label>
              Competition*:
              <select
                name="competitionId"
                value={formData.competitionId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a competition</option>
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Code Prefix*:
              <input
                type="text"
                name="codePrefix"
                value={formData.codePrefix}
                onChange={handleInputChange}
                required
                maxLength={20}
              />
            </label>
            <div className='League-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default League;