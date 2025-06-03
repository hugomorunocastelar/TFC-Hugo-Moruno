import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Gameplace.css';

function Gameplace() {
  const [gameplaces, setGameplaces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedGameplace, setSelectedGameplace] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    gamefields: 1,
    address: '',
    idCity: '',
  });

  // Fetch gameplaces
  const fetchGameplaces = async () => {
    try {
      const response = await fetch('/api/gameplaces'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch gameplaces');
      const data = await response.json();
      setGameplaces(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch cities for dropdown
  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGameplaces();
    fetchCities();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      gamefields: 1,
      address: '',
      idCity: '',
    });
    setSelectedGameplace(null);
    setFormOpen(true);
  };

  const openFormForEdit = (gameplace) => {
    setFormData({
      id: gameplace.id,
      name: gameplace.name,
      gamefields: gameplace.gamefields || 1,
      address: gameplace.address,
      idCity: gameplace.idCity ? gameplace.idCity.id : '',
    });
    setSelectedGameplace(gameplace);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedGameplace(null);
    setFormData({
      id: null,
      name: '',
      gamefields: 1,
      address: '',
      idCity: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/gameplaces/${formData.id}` : '/api/gameplaces'; // Replace with your URLs
      const bodyData = {
        name: formData.name,
        gamefields: formData.gamefields,
        address: formData.address,
        idCity: formData.idCity ? { id: formData.idCity } : null,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save gameplace');
      await fetchGameplaces();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gameplace?')) return;
    try {
      const response = await fetch(`/api/gameplaces/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete gameplace');
      await fetchGameplaces();
      if (selectedGameplace && selectedGameplace.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Gameplace'>
      <div className='Gameplace-Table'>
        <div className='Gameplace-Table-Header'>
          <h2>Gameplaces</h2>
          <NewButton action={openFormForCreate} text="Gameplace" />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gamefields</th>
              <th>Address</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gameplaces.map(gp => (
              <tr key={gp.id}>
                <td>{gp.name}</td>
                <td>{gp.gamefields}</td>
                <td>{gp.address}</td>
                <td>{gp.idCity ? gp.idCity.name : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(gp)}>Edit</button>
                  <button onClick={() => handleDelete(gp.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {gameplaces.length === 0 && (
              <tr>
                <td colSpan="5">No gameplaces found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='Gameplace-Form'>
          <h2>{formData.id ? 'Edit Gameplace' : 'New Gameplace'}</h2>
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
              Gamefields*:
              <input
                type="number"
                name="gamefields"
                value={formData.gamefields}
                onChange={handleInputChange}
                min={1}
                required
              />
            </label>
            <label>
              Address*:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                maxLength={100}
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
            <div className='Gameplace-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Gameplace;