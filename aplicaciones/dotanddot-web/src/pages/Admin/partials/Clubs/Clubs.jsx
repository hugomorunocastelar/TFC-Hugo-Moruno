import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Clubs.css';
import { getAllClubs } from '../../../../js/cruds/clubs.mjs';
import { getAllCities } from '../../../../js/cruds/cities.mjs';

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    idCity: '',
  });

  // Fetch clubs - replace URL with your API endpoint
  const fetchClubs = async () => {
    try {
      getAllClubs()
      .then((response) => {
        if (response) setClubs(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCities = async () => {
    try {
      getAllCities()
      .then((response) => {
        if (response) setCities(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClubs();
    fetchCities();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      idCity: '',
    });
    setSelectedClub(null);
    setFormOpen(true);
  };

  const openFormForEdit = (club) => {
    setFormData({
      id: club.id,
      name: club.name,
      idCity: club.idCity?.id || '',
    });
    setSelectedClub(club);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedClub(null);
    setFormData({
      id: null,
      name: '',
      idCity: '',
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
      const url = formData.id ? `/api/clubs/${formData.id}` : '/api/clubs'; // Replace with your URLs
      const bodyData = {
        name: formData.name,
        idCity: formData.idCity,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save club');
      await fetchClubs();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      const response = await fetch(`/api/clubs/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete club');
      await fetchClubs();
      if (selectedClub && selectedClub.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Clubs'>
      <div className='Clubs-Table'>
        <div className='Clubs-Table-Header'>
          <h2>Clubs</h2>
          <NewButton action={openFormForCreate} text="Club" />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map(club => (
              <tr key={club.id}>
                <td>{club.name}</td>
                <td>{club.idCity?.name || ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(club)}>Edit</button>
                  <button onClick={() => handleDelete(club.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {clubs.length === 0 && (
              <tr>
                <td colSpan="3">No clubs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='Clubs-Form'>
          <h2>{formData.id ? 'Edit Club' : 'New Club'}</h2>
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
              City*:
              <select
                name="idCity"
                value={formData.idCity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
            <div className='Clubs-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Clubs;