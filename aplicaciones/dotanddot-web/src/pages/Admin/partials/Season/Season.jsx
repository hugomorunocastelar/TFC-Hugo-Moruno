import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Season.css';

function Season() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    initialDay: '',
    finalisationDay: '',
  });

  // Fetch seasons
  const fetchSeasons = async () => {
    try {
      const response = await fetch('/api/seasons'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch seasons');
      const data = await response.json();
      setSeasons(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      initialDay: '',
      finalisationDay: '',
    });
    setSelectedSeason(null);
    setFormOpen(true);
  };

  const openFormForEdit = (season) => {
    setFormData({
      id: season.id,
      name: season.name || '',
      initialDay: season.initialDay ? season.initialDay.split('T')[0] : '',
      finalisationDay: season.finalisationDay ? season.finalisationDay.split('T')[0] : '',
    });
    setSelectedSeason(season);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedSeason(null);
    setFormData({
      id: null,
      name: '',
      initialDay: '',
      finalisationDay: '',
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
      const url = formData.id ? `/api/seasons/${formData.id}` : '/api/seasons'; // Replace with your URLs
      const bodyData = {
        name: formData.name,
        initialDay: formData.initialDay,
        finalisationDay: formData.finalisationDay,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save season');
      await fetchSeasons();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this season?')) return;
    try {
      const response = await fetch(`/api/seasons/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete season');
      await fetchSeasons();
      if (selectedSeason && selectedSeason.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Season'>
      <div className='Season-Table'>
        <div className='Season-Table-Header'>
          <h2>Seasons</h2>
          <NewButton action={openFormForCreate} text="Season" />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Initial Day</th>
              <th>Finalisation Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map(season => (
              <tr key={season.id}>
                <td>{season.name}</td>
                <td>{season.initialDay ? season.initialDay.split('T')[0] : ''}</td>
                <td>{season.finalisationDay ? season.finalisationDay.split('T')[0] : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(season)}>Edit</button>
                  <button onClick={() => handleDelete(season.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {seasons.length === 0 && (
              <tr>
                <td colSpan="4">No seasons found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='Season-Form'>
          <h2>{formData.id ? 'Edit Season' : 'New Season'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                maxLength={50}
              />
            </label>
            <label>
              Initial Day:
              <input
                type="date"
                name="initialDay"
                value={formData.initialDay}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Finalisation Day:
              <input
                type="date"
                name="finalisationDay"
                value={formData.finalisationDay}
                onChange={handleInputChange}
              />
            </label>
            <div className='Season-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Season;